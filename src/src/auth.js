var passport = require('koa-passport');
var Auth0Strategy = require('passport-auth0');
const config = require('./config');
const debug = require('debug')('app:auth');


var strategy = new Auth0Strategy({
  domain:       'movelmobile.auth0.com',
  clientID:     'SdMQqjyMjjWAM2NbxfY8BJXK28JgQ2iB',
  clientSecret: 'Att9Ez3cxbebglWBaL4hLTPWsWJEn8ml0dg4IvGPi8MF5eoewj-D74VsL5r0QM_7',
  callbackURL:  config.AUTH_CALLBACK_URL
}, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
  console.log(`Auth0Strategy cb: ${accessToken}`);
  console.log(` extra: ${JSON.stringify(extraParams, null, 2) }`);
  console.log(` profile: ${JSON.stringify(profile, null, 2)}`);
  return done(null, Object.assign({}, profile, {_raw: extraParams.id_token}));
});

debug(`Create Auth0 strategy with callbackURL: ${config.AUTH_CALLBACK_URL}`);

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;

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
