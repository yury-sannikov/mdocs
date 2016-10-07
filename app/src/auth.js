var passport = require('koa-passport');
var Auth0Strategy = require('passport-auth0');
const config = require('./config');
const debug = require('debug')('app:auth');
var co = require('co');
var Auth0Profile = require('passport-auth0/lib/Profile');
import { getSubscriptionInfo } from './stripe';
import { findUserById, findAccountById } from './db'
import _ from 'lodash';

var strategy = new Auth0Strategy({
  domain:       'movelmobile.auth0.com',
  clientID:     'SdMQqjyMjjWAM2NbxfY8BJXK28JgQ2iB',
  clientSecret: 'Att9Ez3cxbebglWBaL4hLTPWsWJEn8ml0dg4IvGPi8MF5eoewj-D74VsL5r0QM_7',
  callbackURL:  config.AUTH_CALLBACK_URL
}, function(accessToken, refreshToken, extraParams, profile, done) {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  // console.log(`Auth0Strategy cb: ${accessToken}`);
  // console.log(` extra: ${JSON.stringify(extraParams, null, 2) }`);
  // console.log(` profile: ${JSON.stringify(profile, null, 2)}`);
  return done(null, Object.assign({}, profile, {jwtToken: extraParams.id_token}));
});

debug(`Create Auth0 strategy with callbackURL: ${config.AUTH_CALLBACK_URL}`);

passport.use(strategy);

function massageUser(user) {
  let sessionUser = Object.assign({}, user);
  delete sessionUser._json;
  delete sessionUser._raw;
  return sessionUser;
}

passport.serializeUser(function(user, done) {
  co(function* () {
    const dbuser = yield findUserById(user.id);
    const stripeId = _.get(dbuser, 'stripeId', _.get(dbuser, 'stripeCustomer.id'))

    const emptySet = {_empty: true}
    let account = {
      rights: emptySet,
      profiles: []
    }
    if (dbuser.account_id) {
      const dbaccount = yield findAccountById(dbuser.account_id)
      if (dbaccount) {
        account = Object.assign({}, dbaccount, {
          rights: _.get(dbaccount, `rights.${user.id}`, emptySet),
          profiles: _.get(dbaccount, `profiles.${user.id}`, [])
        })
      }
    }

    return massageUser(Object.assign({}, user, {
      account_id: dbuser.account_id,
      stripeId: stripeId,
      account: account
    } ));
  }).then(function (data) {
    done(null, data);
  }, function (err) {
    done(err);
  });
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Use Auth0 Profile class to create seamless profile as passport-auth0 does.
export function serializeUserFromProfile(profile, jwtToken) {
  return Object.assign({},
    massageUser(new Auth0Profile(profile)),
    {
      displayName: profile.email,
      jwtToken
    });
}

/*
var user = { id: 1, username: 'test' };

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, user);
});

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(username, password, done) {
  // retrieve user ...
  if (username === 'test' && password === 'test') {
    done(null, user);
  } else {
    done(null, false);
  }
}));

var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
  clientID: 'your-client-id',
  clientSecret: 'your-secret',
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
},
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));

var TwitterStrategy = require('passport-twitter').Strategy;
passport.use(new TwitterStrategy({
  consumerKey: 'your-consumer-key',
  consumerSecret: 'your-secret',
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
},
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));

var GoogleStrategy = require('passport-google-auth').Strategy;
passport.use(new GoogleStrategy({
  clientId: 'your-client-id',
  clientSecret: 'your-secret',
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
},
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));
*/
