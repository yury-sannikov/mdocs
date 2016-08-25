'use strict';
const Router = require('koa-router');
const debug = require('debug')('app:routes:api:appointment');
import cors from 'koa-cors'
import _ from 'lodash'
import moment from 'moment'
import { createNewAppointment, appointmentsForAccount } from '../db/appointments';
// import { sendStripeCallbackToSlack } from '../comm';
// import { needShowCreateProfileAlert } from '../belt';

const TIME_SLOT_MINUTES=30

const router = new Router({
  prefix: '/api/appointment'
});

const corsMiddleware = cors({
  origin: true
})

router.use(corsMiddleware)

router.options('/',  function*() {} )
router.options('/*',  function*() {} )


router.post('/', function*() {
  const requestObject = _.fromPairs(_.map(this.request.body, o => ([o.name, o.value])))

  if (!requestObject.account_id) {
    throw new Error('Unknown account ID')
  }

  const dob = moment(requestObject.form_dob || '', 'MM/DD/YYYY')
  const visitDate = moment(requestObject.form_date || '', 'MM/DD/YYYY hh:m a')

  const dbObject = {
    patient_name: requestObject.form_name,
    patient_email: requestObject.email,
    patient_phone: requestObject.form_phone,
    patient_new: requestObject.form_name_new === 'yes',
    patient_reason: requestObject.form_reason,
    patient_dob: dob.isValid() ? dob.utc().unix() : 0
  }

  const id = yield createNewAppointment(requestObject.account_id,
    visitDate.isValid() ? visitDate : 0, dbObject)
  this.body = { ok: 1, id: id};
});

router.get('/dashboard', function*() {

  const allItems = (yield appointmentsForAccount(this.currentUserAccount.account_id))
    .map( i => {
      i.patient_dob = i.patient_dob ? moment.unix(i.patient_dob) : undefined
      i.visit_date = i.visit_date ? moment.unix(i.visit_date) : undefined
      return i
    })

  const overviewStart = moment().add(-TIME_SLOT_MINUTES, 'm')
  const overviewEvents = allItems.filter( item => {
    return item.visit_date && item.visit_date.isAfter(overviewStart)
  })

  const unconfirmed = allItems.filter( item => {
    return item.status === 'new'
  })

  const statMap = {
    'new': 'unconfirmedCount',
    'confirm': 'upcomingCount',
    'discharge': 'finished'
  }
  const stats = allItems.reduce( (res, item) => {
    res.all = res.all + 1
    const mapped = statMap[item.status]
    mapped && (res[mapped] = res[mapped] + 1)
    return res;
  },
  {
    unconfirmedCount: 0,
    upcomingCount: 0,
    finished: 0,
    all: 0
  })

  this.body = {
    overview: {
      timeSlot: {
        start: overviewStart.unix(),
        end: moment().unix()
      },
      data: overviewEvents
    },
    unconfirmed: unconfirmed,
    stats
  }
});

module.exports = router;
