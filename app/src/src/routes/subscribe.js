
import Router from 'koa-router';
import _ from 'lodash';
import bouncer from 'koa-bouncer';
import {createSubscription} from '../stripe';
import { findUserByEmail, findUserById, insertOrUpdateUser } from '../db';
import { createUser, loginUser } from '../auth0';
import jwt from 'jsonwebtoken';
import { serializeUserFromProfile } from '../auth';

const debug = require('debug')('app:routes:subscribe');

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
  yield renderPayment.call(this, this.params.plan);
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

    this.session.hasSubscription = true;
  } catch(err) {
    console.log(err.stack);
    yield renderPayment.call(this, this.request.body.plan, err.message);
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

function* renderPayment(plan, errorMessage) {
  const thisPlan = _.has(PLAN_INFO, plan) && PLAN_INFO[plan];

  if (!thisPlan) {
    this.redirect(router.url('pricing'));
    return;
  }
  let hasSubscription = false;

  if (this.currentUser) {
    const user = yield findUserById(this.currentUser.id);
    hasSubscription = !_.isEmpty(user) && !_.isEmpty(user.stripeCustomer);
  }

  this.render('subscribe/payment', Object.assign({}, this.jadeLocals, {
    bareHeader : true,
    changePlanUrl: router.url('pricing'),
    checkoutUrl: router.url('checkout'),
    plan,
    planInfo: thisPlan,
    messages : errorMessage ? { error: [{msg: errorMessage}] } : {},
    hasSubscription
  }), true);
}


function* checkoutNewUser() {

  if (this.currentUser) {
    throw Error('You should log out first to sign up a new user');
  }

  this.request.body.name.trim();

  console.log(this.request.body);

  const userProfile = yield createUser(this.request.body.email, this.request.body.pass, this.request.body.name);

  const loginResult = yield loginUser(this.request.body.email, this.request.body.pass);

  const decoded = jwt.decode(loginResult.id_token);

  debug(`Successfully created new user ${this.request.body.email} with id ${decoded.sub}`);

  const sessionProfile = serializeUserFromProfile(userProfile, loginResult.id_token);

  debug(`Create user session with user profile: ${JSON.stringify(sessionProfile)}`);

  yield this.login(sessionProfile);

  yield insertOrUpdateUser(decoded.sub,
      Object.assign({}, {
        id: decoded.sub,
        email: this.request.body.email
      }));

  const planId = `${this.request.body.plan}-${this.request.body.payOccurence}`;

  yield createSubscription(decoded.sub, this.request.body.stripeToken, planId);

  this.render('subscribe/success', Object.assign({}, this.jadeLocals, {
    bareHeader : true,
    plan: this.request.body.plan,
    planInfo: PLAN_INFO[this.request.body.plan],
    redirectUrl: DASHBOARD_URL
  }, true));

}

function* checkoutExistingUser() {
  // Check if user really logged in. If not just redirect to payment
  if (this.currentUser.id !== this.request.body.hasUser) {
    this.redirect(router.url('payment', {plan: this.request.body.plan}));
    return;
  }

  const planId = `${this.request.body.plan}-${this.request.body.payOccurence}`;
  yield createSubscription(this.currentUser.id, this.request.body.stripeToken, planId);

  this.render('subscribe/success', Object.assign({}, this.jadeLocals, {
    bareHeader : true,
    plan: this.request.body.plan,
    planInfo: PLAN_INFO[this.request.body.plan],
    redirectUrl: DASHBOARD_URL
  }, true));

}
