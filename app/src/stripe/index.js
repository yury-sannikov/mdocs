
import stripe from 'stripe';
import config from '../config';
import Promise from 'bluebird';
import _ from 'lodash';
import {
  updateUserStripeCustomerToken,
  findUserById,
  getProfiles,
  deleteUserSubscriptionsInfo } from '../db';
const debug = require('debug')('app:stripe');

const stripeApi = stripe(config.STRIPE_SEC_KEY);
stripeApi.setApiVersion('2016-03-07');

const customersAsync = Promise.promisifyAll(stripeApi.customers, { context: stripeApi.customers });
const subscriptionsAsync = Promise.promisifyAll(stripeApi.subscriptions, { context: stripeApi.subscriptions });
const invoicesAsync = Promise.promisifyAll(stripeApi.invoices, { context: stripeApi.invoices });

function* getSubscription(userId) {
  const profiles = yield getProfiles(this.currentUser.account.profiles)
  const user = yield findUserById(userId);
  const stripeId = _.get(user, 'stripeId', _.get(user, 'stripeCustomer.id'))

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

export function* getSubscriptionInfo(userId) {
  const subscription = yield getSubscription(userId);
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

export function* getFutureInvoice(userId) {
  const currentInvoice = yield invoicesAsync.listAsync({limit: 1});
  const currentSubscription = yield getSubscription(userId);
  const user = yield findUserById(userId);
  const stripeId = _.get(user, 'stripeCustomer.id');
  const upcomingInvoice = yield invoicesAsync.retrieveUpcomingAsync(stripeId);
  return {currentInvoice, upcomingInvoice, currentSubscription}
}
