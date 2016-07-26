const cfg = require('../config');
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;
const Promise = require('bluebird');

const management = new ManagementClient({
  token: cfg.AUTH_API_JWT,
  domain: cfg.AUTH_CLIENT_NAMESPACE
});

const auth0 = new AuthenticationClient({
  domain: cfg.AUTH_CLIENT_NAMESPACE,
  clientId: cfg.AUTH_CLIENT_ID
});

const usersAsync = Promise.promisifyAll(management.users, {context: management.users});

const tokensAsync = Promise.promisifyAll(auth0.tokens, {context: auth0.tokens});

const databaseAuth = Promise.promisifyAll(auth0.database, {context: auth0.database});

const DEFAULT_CONNECTION = 'Username-Password-Authentication';

exports.loginUser = function*(email, password) {
  var data = {
    username: email,
    password: password,
    connection: DEFAULT_CONNECTION
  };

  return yield databaseAuth.signIn(data);
};

exports.getUserByEmail = function* (email) {
  const params = {
    q:`email:${email}`,
    search_engine: 'v2'
  };

  const users = yield usersAsync.getAllAsync(params);

  return users.length == 0 ? null : users[0];
};

exports.createUser = function* (email, pwd, name) {

  const params = {
    connection: DEFAULT_CONNECTION,
    email: email,
    password: pwd,
    email_verified: false,
    user_metadata: {
      name: name
    }
  };

  return yield usersAsync.createAsync(params);

};

exports.getUserInfo = function* (idToken) {
  return yield tokensAsync.getInfoAsync(idToken);
};

