
import Router from 'koa-router';
import _ from 'lodash';

const debug = require('debug')('app:routes:index');


const PLAN_INFO = {
  'pr-basic': {
    name: 'Patient Reviews',
    price: [49, 490, 880]
  },
  'pr-analysis': {
    name: 'Patient Reviews with Data Analysis',
    price: [69, 690, 1240]
  },
  'pr-enterprise': {
    name: 'Enterprise',
    price: [0, 0, 0]
  }
};

const router = new Router({
  prefix: '/subscribe'
});

router.get('/', function*() {
  this.redirect(router.url('pricing'));
});

router.get('pricing', '/pricing', function*() {
  this.render('subscribe/pricing', Object.assign({}, this.jadeLocals, {
    bareHeader : true,
    plans: [
      router.url('payment', {plan: 'pr-basic'}),
      router.url('payment', {plan: 'pr-analysis'}),
      router.url('payment', {plan: 'pr-enterprise'})
    ]
  }), true);
});

router.get('payment', '/payment/:plan', function*() {
  const thisPlan = PLAN_INFO[this.params.plan];

  if (!thisPlan) {
    this.redirect(router.url('pricing'));
    return;
  }

  this.render('subscribe/payment', Object.assign({}, this.jadeLocals, {
    bareHeader : true,
    changePlanUrl: router.url('pricing'),
    plan: this.params.plan,
    planInfo: thisPlan
  }), true);
});

module.exports = router;
