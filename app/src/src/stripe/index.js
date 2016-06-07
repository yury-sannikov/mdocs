
import stripe from 'stripe';
import config from '../config';
import Promise from 'bluebird';
import { updateUserStripeCustomerToken, findUserById } from '../db';
const debug = require('debug')('app:stripe');

const stripeApi = stripe(config.STRIPE_SEC_KEY);
stripeApi.setApiVersion('2016-03-07');

const customersAsync = Promise.promisifyAll(stripeApi.customers, { context: stripeApi.customers });

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
