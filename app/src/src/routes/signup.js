'use strict';
const Router = require('koa-router');

const router = new Router({
  prefix: '/signup'
});

router.post('/user', function() {
  console.log(`Signup user: ${JSON.stringify(this.request.body, null, 2)}`);
  this.body = {
    success: true,
    data: this.request.body
  };
});

module.exports = router;
