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

function hasDynamoData(data) {
  if (_.isEmpty(data) || !_.isArray(data)) {
    return false;
  }
  return _.isArray(data[0]) && data[0].length > 0;
}

////////////////////////////////////////////////////////////
// Check for authentification for all routes below
router.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.redirect(`/login?r=${encodeURIComponent(this.request.url)}`);
  }
});

// Add Subscribe routes into the app
router.use(require('./subscribe').routes());


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
  const providers = yield db.providersForAdmin(this.currentUser.id);
  const locations = yield db.locationsForAdmin(this.currentUser.id);
  this.render('reviews/reviews', Object.assign({}, this.jadeLocals, {reviews: reviews, providers: providers[0], locations: locations[0]}), true);
});

function* conductSurvey(id) {
  
  const result = yield communicator.conductSurvey(id);
  if (result.sms === true && result.email === true) {
    this.flash = 'Survey has been successfully delivered';
  } else {
    let flash = 'An error occurred while delivering survey. ';
    if (result.sms !== true) {
      flash = flash + 'Error while sending SMS. ';
    }
    if (result.email !== true) {
      flash = flash + 'Error while sending email. ';
    }
    this.flash = flash;
  }
}

router.post('/resend-survey', function*() {
  const data = yield db.surveyById(this.request.body.id);
  if (!hasDynamoData(data)) {
    this.redirect('patient-reviews');
    return;
  }
  yield conductSurvey.call(this, this.request.body.id);
  
  this.redirect('patient-reviews');
});

router.post('/new-request', function*() {
  const locationOrProvider = this.request.body.locationOrProvider;
  const reviewSite = this.request.body.reviewSite;
  const isProvider = this.request.body.isProvider === 'yes';
  
  if (!locationOrProvider || !reviewSite || !this.request.body.isProvider) {
    // Client JS should avoid this path
    throw Error('Form is not filled properly.');
  }
  
  const survey = Object.assign({}, this.request.body, {
    reviewFor: {
      id: locationOrProvider,
      reviewType: isProvider ? 'provider' : 'location'
    },
    reviewSite: reviewSite
  });
  
  const providerOrLocation = yield db.getReviewObject(survey.reviewFor.id, survey.reviewFor.reviewType);
  
  if (!hasDynamoData(providerOrLocation)) {
    debug(`Can't find review object: ${JSON.stringify(survey.reviewFor)}`);
    this.flash = 'Unable to find specified review object';
    this.redirect('patient-reviews');
    return;
  }
  
  const title = providerOrLocation[0][0].name;
  
  const questions = Object.assign({}, HARDCODED_QUESTIONS, { '2': title });
  console.log(this.currentUser.id, survey, questions, title);
  const id = yield db.createNewSurvey()(this.currentUser.id, survey, questions, title);
  
  yield conductSurvey.call(this, id);
  
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

// Show Pricing & Sign up
router.get('/pricing-signup', function*() {
  // this.render('privacy/privacy', this.jadeLocals, true);
  console.log("Routed");
  res.sendFile(path.join(__dirname+'/pricing-signup.html'));
});

// Show providers
router.get('/providers', function*() {
  const data = yield db.providersForAdmin(this.currentUser.id);
  this.render('settings/providers', Object.assign({}, this.jadeLocals, {providers: data[0]}), true);
});

router.get('/provider/:id', function*() {
  const data = yield db.providerById(this.params.id);
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect('/app/providers');
    return;
  }
  this.render('settings/providerDetail', Object.assign({}, this.jadeLocals, { provider: data[0][0] }), true);
});

router.post('/new-provider', function*() {
  console.log(this.request.body);
  
  const provider = Object.assign({}, this.request.body);
  const id = yield db.createProvider()(this.currentUser.id, provider);

  this.redirect('providers');
});

router.post('/update-provider', function*() {
  console.log(this.request.body);
  
  const provider = Object.assign({}, this.request.body);
  const id = yield db.updateProvider(this.request.body.editID, provider);

  this.redirect('providers');
});

router.post('/delete-provider', function*() {
  yield db.deleteProvider(this.request.body.id);
  this.flash = 'Provider deleted successfully.';
  this.redirect('providers');
});

// Show office locations
router.get('/locations', function*() {
  const data = yield db.locationsForAdmin(this.currentUser.id);
  this.render('settings/locations', Object.assign({}, this.jadeLocals, {locations: data[0]}), true);
});

router.get('/location/:id', function*() {
  const data = yield db.locationById(this.params.id);
  console.log(this.params.id)
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect('/app/locations');
    return;
  }
  this.render('settings/locationDetail', Object.assign({}, this.jadeLocals, { location: data[0][0] }), true);
});

router.post('/new-location', function*() {
  console.log(this.request.body);
  
  const location = Object.assign({}, this.request.body);
  const id = yield db.createLocation()(this.currentUser.id, location);

  this.redirect('locations');
});

router.post('/update-location', function*() {
  console.log(this.request.body);
  
  const location = Object.assign({}, this.request.body);
  const id = yield db.updateLocation(this.request.body.editID, location);

  this.redirect('locations');
});

router.post('/delete-location', function*() {
  yield db.deleteLocation(this.request.body.id);
  this.flash = 'Location deleted successfully.';
  this.redirect('locations');
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
