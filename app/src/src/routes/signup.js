/*'use strict';
const Router = require('koa-router');
const _ = require('lodash');
const bouncer = require('koa-bouncer');
const db = require('../db');
const debug = require('debug')('app:routes:signup');
const auth0 = require('../auth0');

const router = new Router({
  prefix: '/signup'
});

router.use(function*(next) {
  try {
    yield* next;
  } catch(err) {
    if (err instanceof bouncer.ValidationError) {
      this.body = {
        error: err.message,
        success: false,
        reason: {
          validation: true
        }        
      };
      return;
    }
    throw err;
  }
});

router.post('/user', function*() {
  
  this.validateBody('name')
    .required('Username required')
    .isString()
    .trim()
    .isLength(6, 100, 'User name must be set');
 
  this.validateBody('email')
    .required('Email required')
    .isEmail('Invalid email')
    .trim();

  this.validateBody('pwd')
    .required('Password required')
    .isLength(6, 100, 'Password must be 6-100 chars');
  
  const user = yield db.findUserByEmail(this.request.body.email);
  
  if (!user) {
    try {      
      yield auth0.createUser(this.request.body.email, this.request.body.pwd, this.request.body.name);
    }
    catch(e) {
      debug(`Unable to create user. ${e}`);
      this.body = {
        success: false,
        reason: {
          createUser: true
        },
        message: e.message
      };
      return;
    }

    this.body = yield loginUser(this.request.body.email, this.request.body.pwd);
    return;
  }
  
  
  if (user.active_subscription) {
    debug(`Trying to signup existing user ${this.request.body.email} with active subscription`);
    
    this.body = {
      success: false,
      reason: {
        hasActiveSubscription: true
      },
      message: 'Your subscription is already active. Please login instead.'
    };
    return;
  }
  
  debug(`Trying to signup existing user ${this.request.body.email} with inactive subscription`);

  this.body = yield loginUser(this.request.body.email, this.request.body.pwd);

});

module.exports = router;

function* loginUser(email, pwd) {

  let loginResult;
  try {      
    loginResult = yield auth0.loginUser(email, pwd);
  }
  catch(e) {
    debug(`Wrong credentials. ${e}`);
    return {
      success: false,
      reason: {
        hasAccount: true
      },
      message: 'You already have account with us. Please enter correct password or use `forgot password` feature.'
    };
  }
  
  return {
    success: true,
    id_token: loginResult.id_token
  };
  
}
*/
