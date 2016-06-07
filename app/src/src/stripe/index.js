
import stripe from 'stripe';
import config from '../config';
import Promise from 'bluebird';
import _ from 'lodash';
import {
  updateUserStripeCustomerToken,
  findUserById,
  locationsForAdmin,
  providersForAdmin } from '../db';
const debug = require('debug')('app:stripe');

const stripeApi = stripe(config.STRIPE_SEC_KEY);
stripeApi.setApiVersion('2016-03-07');

const customersAsync = Promise.promisifyAll(stripeApi.customers, { context: stripeApi.customers });
const subscriptionsAsync = Promise.promisifyAll(stripeApi.subscriptions, { context: stripeApi.subscriptions });

export function* createSubscription(userId, token, plan, email) {

  const user = yield findUserById(userId);

  if (!user) {
    throw Error(`Unable to create subscription for user id ${userId}. User not found`);
  }

  if (user.stripeCustomer) {
    throw Error('User already has subscription');
  }

  const params = {
    source: token,
    plan,
    email: user.email
  };

  const customer = yield customersAsync.createAsync(params);

  debug(`Created new customer for user id ${userId}: ${JSON.stringify(customer)}`);

  yield updateUserStripeCustomerToken(userId, customer, token);

}

function* getSubscription(userId) {
  const locations = yield locationsForAdmin(userId);
  const providers = yield providersForAdmin(userId);
  const user = yield findUserById(userId);
  const stripeId = _.get(user, 'stripeCustomer.id');

  let result = {
    locations: locations[0].length,
    providers: providers[0].length,
    customer: {}
  };

  if (!stripeId) {
    return result;
  }

  try {
    const customer = yield customersAsync.retrieveAsync(stripeId);
    result.customer = customer;
  } catch(err) {
    debug(`Unable to retrieve Stripe customer for stripe id ${stripeId}: ${err}`);
  }
  return result;
}

export function* getSubscriptionInfo(userId) {
  const subscription = yield getSubscription(userId);
  let result = Object.assign({}, {
    locations: subscription.locations,
    providers: subscription.providers,
    subscriptions: []
  });

  if (subscription.customer) {
    result.subscriptions = subscription.customer.subscriptions.data.map( (s) => {
      return {
        planId: s.plan.id,
        qty: s.quantity
      };
    });
  }
  return result;
}

export function* updateSubscription(userId, session) {
  const currentSubscription = yield getSubscription(userId);

  const providersLocations = currentSubscription.providers + currentSubscription.locations;
  const quantity = providersLocations === 0 ? 1 : providersLocations;
  const mainSubscription = _.get(currentSubscription, 'customer.subscriptions.data[0]');
  if (!mainSubscription) {
    return;
  }
  if (mainSubscription.quantity === quantity) {
    session.passport.user.subInfo = Object.assign({}, session.passport.user.subInfo, {
      providers: currentSubscription.providers,
      locations: currentSubscription.locations
    });
    return;
  }
  debug(`Update subscription quantity for user ${userId} from ${mainSubscription.quantity} to ${quantity}`);

  yield subscriptionsAsync.updateAsync(mainSubscription.id, {
    quantity
  });

  if (_.get(session, 'passport.user')) {
    session.passport.user.subInfo = yield getSubscriptionInfo(userId);
  }
}
