
import stripe from 'stripe';
import config from '../config';
import Promise from 'bluebird';
import _ from 'lodash';
import {
  updateUserStripeCustomerToken,
  findUserById,
  deleteUserSubscriptionsInfo } from '../db';
import { getProfiles } from '../db/profiles';
const debug = require('debug')('app:stripe');

const stripeApi = stripe(config.STRIPE_SEC_KEY);
stripeApi.setApiVersion('2016-03-07');

const customersAsync = Promise.promisifyAll(stripeApi.customers, { context: stripeApi.customers });
const subscriptionsAsync = Promise.promisifyAll(stripeApi.subscriptions, { context: stripeApi.subscriptions });
const invoicesAsync = Promise.promisifyAll(stripeApi.invoices, { context: stripeApi.invoices });

function* getSubscription(userId, profileIds) {
  const profiles = yield getProfiles(profileIds)
  const user = yield findUserById(userId);
  const stripeId = _.get(user, 'stripeId', _.get(user, 'stripeId'))

  let result = {
    profiles: profiles.length,
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

export function* getSubscriptionInfo(userId, profileIds) {
  const subscription = yield getSubscription(userId, profileIds);
  let result = Object.assign({}, {
    profiles: subscription.profiles,
    subscriptions: []
  });

  const { customer: { subscriptions: { data = [] } = {} } = {} } = subscription || {};
  if (subscription.customer) {
    result.subscriptions = data.map( (s) => {
      return {
        planId: s.plan.id,
        qty: s.quantity
      };
    });
  }
  return result;
}

export function* getFutureInvoice(userId, profileIds) {
  const currentInvoice = yield invoicesAsync.listAsync({limit: 1});
  const currentSubscription = yield getSubscription(userId, profileIds);
  const user = yield findUserById(userId);
  const stripeId = _.get(user, 'stripeId');
  const upcomingInvoice = yield invoicesAsync.retrieveUpcomingAsync(stripeId);
  return {currentInvoice, upcomingInvoice, currentSubscription}
}
