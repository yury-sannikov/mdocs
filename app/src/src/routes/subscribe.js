
import Router from 'koa-router';
import _ from 'lodash';
import bouncer from 'koa-bouncer';
import {createSubscription} from '../comm/stripe';
import { findUserByEmail } from '../db';

const debug = require('debug')('app:routes:index');
const DASHBOARD_URL = '/app';

const PLAN_INFO = {
  'pr-basic': {
    name: 'Patient Reviews',
    price: [49, 490, 880]
  },
  'pr-analysis': {
    name: 'Patient Reviews with Data Analysis',
    price: [69, 690, 1240]
  },
  'pr-enterprise': {
    name: 'Enterprise',
    price: [0, 0, 0]
  }
};

const router = new Router({
  prefix: '/subscribe'
});

router.get('/', function*() {
  this.redirect(router.url('pricing'));
});

router.get('pricing', '/pricing', function*() {
  this.render('subscribe/pricing', Object.assign({}, this.jadeLocals, {
    bareHeader : true,
    plans: [
      router.url('payment', {plan: 'pr-basic'}),
      router.url('payment', {plan: 'pr-analysis'}),
      router.url('payment', {plan: 'pr-enterprise'})
    ]
  }), true);
});

router.get('payment', '/payment/:plan', function*() {
  renderPayment.call(this, this.params.plan);
});

router.post('checkout', '/checkout', function*() {
  try {
    this.validateBody('stripeToken')
      .required('Invalid Stripe Token')
      .isString()
      .trim()
      .isLength(20, 60, 'Invalid Stripe Token');

    if (_.isEmpty(this.request.body.hasUser)) {
      yield checkoutNewUser.call(this);
    } else {
      yield checkoutExistingUser.call(this);
    }
  } catch(err) {
    renderPayment.call(this, this.request.body.plan, err.message);
    return;
  }
});

router.get('/payment/emailCheck', function*() {
  let exists = false;

  if (_.isString(this.query.e) && !_.isEmpty(this.query.e)) {
    exists = !!(yield findUserByEmail(this.query.e));
  }

  this.body = {
    success: true,
    userExists: exists
  };
});

module.exports = router;

function renderPayment(plan, errorMessage) {
  const thisPlan = _.has(PLAN_INFO, plan) && PLAN_INFO[plan];

  if (!thisPlan) {
    this.redirect(router.url('pricing'));
    return;
  }

  this.render('subscribe/payment', Object.assign({}, this.jadeLocals, {
    bareHeader : true,
    changePlanUrl: router.url('pricing'),
    checkoutUrl: router.url('checkout'),
    plan: plan,
    planInfo: thisPlan,
    messages : errorMessage ? { error: [{msg: errorMessage}] } : {}
  }), true);
}


function* checkoutNewUser() {
  this.body = 'Not impl yet';

}

function* checkoutExistingUser() {
  // Check if user really logged in. If not just redirect to payment
  if (this.currentUser.id !== this.request.body.hasUser) {
    this.redirect(router.url('payment', {plan: this.request.body.plan}));
    return;
  }

  yield subscribeUser(this.request.body.stripeToken, this.currentUser.id, `${this.request.body.plan}-${this.request.body.payOccurence}`);

  this.render('subscribe/success', Object.assign({}, this.jadeLocals, {
    bareHeader : true,
    plan: this.request.body.plan,
    planInfo: PLAN_INFO[this.request.body.plan],
    redirectUrl: DASHBOARD_URL
  }, true));

}

function* subscribeUser(stripeToken, userId, plan) {

  yield createSubscription(userId, stripeToken, plan);

}
