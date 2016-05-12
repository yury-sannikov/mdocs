'use strict';
// 3rd party
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:index');
const _ = require('lodash');

// 1st party
const db = require('../db');
const communicator = require('../comm');

// const db = require('../db');
// const pre = require('../presenters');
// const mw = require('../middleware');
// const config = require('../config');
// const belt = require('../belt');
// const paginate = require('../paginate');
// const cache = require('../cache');

//
// The index.js routes file is mostly a junk drawer for miscellaneous
// routes until it's accumulated enough routes to warrant a new
// routes/*.js module.
//
const HARDCODED_QUESTIONS = {
  '0': 'Overall Satisfaction',
  '1': 'Staff',
  '2': 'Dr. Mary Mayer, MD'
};

const router = new Router({
  prefix: '/app'
});

////////////////////////////////////////////////////////////
// Check for authentification for all routes below
router.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.redirect('/');
  }
});

// Show Dashboard
router.get('/', function*() {
  this.render('app/dashboard', this.jadeLocals, true);
});

router.get('/patient-reviews', function*() {
  const data = yield db.surveysForProvider(this.currentUser.id);
  const reviews = data[0].map((item) => {
    const avg = _.chain(item.answers).values().sum().value() / _.values(item.answers).length;
    return Object.assign({}, item, {averageRating: avg }); 
  });
  this.render('reviews/reviews', Object.assign({}, this.jadeLocals, {reviews: reviews}), true);
});

router.post('/new-request', function *() {
  console.log(this.request.body);
  
  const survey = Object.assign({}, this.request.body);
  
  const id = yield db.createNewSurvey()(this.currentUser.id, survey, 
    Object.assign({}, HARDCODED_QUESTIONS, { '2': survey.physician}));
  
  const result = yield communicator.conductSurvey(id);
  if (result == 0) {
    this.flash = 'Survey has been successfully delivered';
  } else {
    this.flash = 'An error occurred while delivering survey. Try resend.';
  }
  this.redirect('patient-reviews');
});

router.get('/review/:id', function*() {
  const data = yield db.surveyById(this.params.id);
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect('/app/patient-reviews');
    return;
  }
  this.render('reviews/detail', Object.assign({}, this.jadeLocals, { survey: data[0][0] }), true);
});

router.post('/delete-survey', function*() {
  yield db.deleteSurvey(this.request.body.id);
  this.flash = 'Review deleted successfully.';
  this.redirect('patient-reviews');
});

// Show Terms of Use
router.get('/terms', function*() {
  this.render('terms/terms', this.jadeLocals, true);
});

// Show Privacy Policy
router.get('/privacy', function*() {
  this.render('privacy/privacy', this.jadeLocals, true);
});


/*
////////////////////////////////////////////////////////////

// Update user
//
// Body:
// - email: Optional String
// - role: Optional String
router.put('/users/:uname', function*() {
  // Load user
  this.validateParam('uname');
  let user = yield db.getUserByUname(this.vals.uname);
  this.assert(user, 404);
  user = pre.presentUser(user);
  this.assertAuthorized(this.currUser, 'UPDATE_USER_*', user);

  // Validation

  if (this.request.body.role) {
    this.assertAuthorized(this.currUser, 'UPDATE_USER_ROLE', user);
    this.validateBody('role')
      .isString()
      .isIn(['ADMIN', 'MOD', 'MEMBER', 'BANNED']);
  }

  if (this.request.body.email) {
    this.assertAuthorized(this.currUser, 'UPDATE_USER_SETTINGS', user);
    this.validateBody('email')
      .isString()
      .trim();
    if (this.vals.email) {
      this.validateBody('email').isEmail();
    }
  }

  // Update user

  yield db.updateUser(user.id, {
    email: this.vals.email,
    role: this.vals.role
  });

  this.flash = { message: ['success', 'User updated']};
  this.redirect(`${user.url}/edit`);
});

////////////////////////////////////////////////////////////

// Edit user page
router.get('/users/:uname/edit', function*() {
  // Load user
  this.validateParam('uname');
  let user = yield db.getUserByUname(this.vals.uname);
  this.assert(user, 404);
  user = pre.presentUser(user);
  this.assertAuthorized(this.currUser, 'UPDATE_USER_*', user);

  yield this.render('users_edit', {
    ctx: this,
    user,
    title: `Edit ${user.uname}`,
  });
});

////////////////////////////////////////////////////////////

// Show user profile
router.get('/users/:uname', function*() {
  // Load user

  this.validateParam('uname');
  let user = yield db.getUserByUname(this.vals.uname);
  this.assert(user, 404);
  user = pre.presentUser(user);

  // Load user's messages
  const messages = (yield db.getRecentMessagesForUserId(user.id))
    .map(pre.presentMessage);

  yield this.render('users_show', {
    ctx: this,
    user,
    messages,
    title: user.uname,
  });
});

////////////////////////////////////////////////////////////

// Create message
router.post('/messages', mw.ensureRecaptcha, function*() {
  this.assertAuthorized(this.currUser, 'CREATE_MESSAGE');

  // Validation

  this.validateBody('markup')
    .required('Must provide a message')
    .isString()
    .trim()
    .tap(belt.transformMarkup)
    .isLength(3, 300, 'Message must be 3-300 chars');

  // Validation pass, save message

  yield db.insertMessage({
    user_id: this.currUser && this.currUser.id,
    markup: this.vals.markup,
    ip_address: this.request.ip,
    user_agent: this.headers['user-agent']
  });

  this.flash = { message: ['success', 'Message created!'] };
  this.redirect('/');
});

////////////////////////////////////////////////////////////

// List all messages
router.get('/messages', function*() {

  this.validateQuery('page')
    .defaultTo(1)
    .toInt();

  const results = yield {
    messages: db.getMessages(this.vals.page),
    count: cache.get('messages-count')
  };

  const messages = results.messages.map(pre.presentMessage);
  const paginator = paginate.makePaginator(this.vals.page, results.count);

  yield this.render('messages_list', {
    ctx: this,
    messages,
    paginator,
    messagesCount: results.count,
    title: `All Messages`,
  });
});

////////////////////////////////////////////////////////////

// List all users
router.get('/users', function*() {

  this.validateQuery('page')
    .defaultTo(1)
    .toInt();

  const results = yield {
    users: db.getUsers(this.vals.page),
    count: cache.get('users-count')
  };

  const users = results.users.map(pre.presentUser);
  const paginator = paginate.makePaginator(this.vals.page, results.count);

  yield this.render('users_list', {
    ctx: this,
    users,
    paginator,
    usersCount: results.count,
    title: 'All Users',
  });
});

////////////////////////////////////////////////////////////

// Update message
//
// Body:
// - is_hidden: Optional String of 'true' | 'false'
// - markup: Optional String
// - redirectTo: Optional String
router.put('/messages/:id', function*() {
  // Load message
  this.validateParam('id');
  const message = yield db.getMessageById(this.vals.id);
  this.assert(message, 404);

  // Ensure user is authorized to make *any* update to message
  this.assertAuthorized(this.currUser, 'UPDATE_MESSAGE', message);

  // Check authorization against specific changes user is trying to make

  if (this.request.body.is_hidden) {
    this.assertAuthorized(this.currUser, 'UPDATE_MESSAGE_STATE', message);
    this.validateBody('is_hidden')
      .isString()
      .tap(belt.parseBoolean);
  }

  if (this.request.body.markup) {
    this.assertAuthorized(this.currUser, 'UPDATE_MESSAGE_MARKUP', message);
    // FIXME: Extract markup validation into its own .isValidMarkup validator
    // and then reuse this here and in the insert-message route
    this.validateBody('markup')
      .isString()
      .trim()
      .tap(belt.transformMarkup)
      .isLength(3, 300, 'Message must be 3-300 chars');
  }

  this.validateBody('redirectTo')
    .defaultTo('/')
    .isString()
    .checkPred(s => s.startsWith('/'));

  // Update message

  yield db.updateMessage(message.id, {
    is_hidden: this.vals.is_hidden,
    markup: this.vals.markup
  });

  this.flash = { message: ['success', 'Message updated'] };
  this.redirect(this.vals.redirectTo);
});

////////////////////////////////////////////////////////////

// Update user role
//
// Body:
// - role: String
router.put('/users/:uname/role', function*() {
  // Load user
  this.validateParam('uname');
  const user = yield db.getUserByUname(this.vals.uname);
  this.assert(user, 404);

  this.assertAuthorized(this.currUser, 'UPDATE_USER_ROLE', user);

  // Validation

  this.validateBody('role')
    .required('Must provide a role')
    .isString()
    .trim()
    .checkPred(s => s.length > 0, 'Must provide a role')
    .isIn(['ADMIN', 'MOD', 'MEMBER', 'BANNED'], 'Invalid role');

  this.validateBody('redirectTo')
    .defaultTo('/')
    .isString()
    .checkPred(s => s.startsWith('/'));

  // Update user

  yield db.updateUserRole(user.id, this.vals.role);

  this.flash = { message: ['success', 'Role updated'] };
  this.redirect(this.vals.redirectTo);
});
*/
////////////////////////////////////////////////////////////

module.exports = router;
