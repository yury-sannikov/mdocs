
import Router from 'koa-router';
import _ from 'lodash';
import bouncer from 'koa-bouncer';
import {createSubscription, updateSessionSubscriptionInfo} from '../stripe';
import { findUserByEmail, findUserById, insertOrUpdateUser } from '../db';
import { createUser, loginUser, getUserInfo } from '../auth0';
import jwt from 'jsonwebtoken';
import { serializeUserFromProfile } from '../auth';

const debug = require('debug')('app:routes:subscribe');

const DASHBOARD_URL = '/app?welcome=y';

const AUTH0_MESSAGES_HASH = {
  password_leaked: 'Auth0 has blocked your account. Please contact support.'
}

const PLAN_INFO = {
  'pr-basic': {
    name: 'Patient Reviews',
    price: [49, 245, 490]
  },
  'pr-analysis': {
    name: 'Patient Reviews with Data Analysis',
    price: [69, 345, 690]
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

    yield updateSessionSubscriptionInfo(this, this.session.passport.user.id);

  } catch(err) {
    debug(JSON.stringify(err));
    yield renderPayment.call(this,
      this.request.body.plan,
      err.message || AUTH0_MESSAGES_HASH[err.name] || err.name,
      this.request.body);
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

function* renderPayment(plan, errorMessage, formValues) {
  const thisPlan = _.has(PLAN_INFO, plan) && PLAN_INFO[plan];

  if (!thisPlan) {
    this.redirect(router.url('pricing'));
    return;
  }
  let hasSubscription = false;

  if (this.currentUser) {
    const user = yield findUserById(this.currentUser.id);
    hasSubscription = !_.isEmpty(user) && !_.isEmpty(user.stripeCustomer) && !_.isEmpty(user.stripeCustomer.id);
  }

  this.render('subscribe/payment', Object.assign({}, this.jadeLocals, {
    bareHeader : true,
    changePlanUrl: router.url('pricing'),
    checkoutUrl: router.url('checkout'),
    plan,
    planInfo: thisPlan,
    messages : errorMessage ? { error: [{msg: errorMessage}] } : {},
    hasSubscription,
    formValues: formValues || {}
  }), true);
}


function* checkoutNewUser() {

  if (this.currentUser) {
    throw Error('You should log out first to sign up a new user');
  }

  this.validateBody('name')
    .required('Full name is required')
    .isString()
    .isLength(5, 60, 'Full Name should be between 5 and 60 symbols')
    .trim();

  this.validateBody('email')
    .required('Email required')
    .isEmail('Invalid email')
    .trim();

  this.validateBody('pass')
    .required('Password required')
    .isString()
    .isLength(1, 100, 'Password must be 1-100 chars');

  this.validateBody('passcheck')
    .required('Password confirmation required')
    .isString()
    .eq(this.vals.pass, 'Passwords must match');

  this.validateBody('email')
    .checkNot(yield findUserByEmail(this.vals.email), 'Username taken');

  this.request.body.name.trim();

  let loginResult

  // Try login first with supplied credentials
  try {
    loginResult = yield loginUser(this.request.body.email, this.request.body.pass);

    debug(`checkoutNewUser has been invoked with existing user credentials. User name: ${this.request.body.email}`)
  }
  catch(e) {

  }

  let userProfile;

  if (loginResult) {
    debug(`Getting user profile from its id_token`)
    userProfile = yield getUserInfo(loginResult.id_token)
    debug(`User profile has been received successfully`)
  } else {
    debug(`Creating user profile`)
    userProfile = yield createUser(this.request.body.email, this.request.body.pass, this.request.body.name);
    loginResult = yield loginUser(this.request.body.email, this.request.body.pass);
  }

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
  if (!this.currentUser || this.currentUser.id !== this.request.body.hasUser) {
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
