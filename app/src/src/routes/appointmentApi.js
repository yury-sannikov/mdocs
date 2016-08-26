'use strict';
const Router = require('koa-router');
const debug = require('debug')('app:routes:api:appointment');
import cors from 'koa-cors'
import _ from 'lodash'
import moment from 'moment'
import { createNewAppointment,
  appointmentsForAccount,
  appointmentById,
  updateAppointment } from '../db/appointments';
import { findAccountById } from '../db'
import { sendSMS } from '../comm/sms'
import { sendAppointmentEmail } from '../comm/email'
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

function* notifyPracticeAdmins(accountId, text) {
  debug(`Notifying Office Administrators of account ${accountId}: ${text}`)

  const account = yield findAccountById(accountId)

  yield sendSMS(account.practiceAdmin.phone, text)

  const emailData = {
    title: 'MDOCS Appointments',
    message: text,
    adminUrl: 'https://app.mdocs.co/app/appointments'
  }
  try {
    yield sendAppointmentEmail(account.practiceAdmin.email, emailData)
  }
  catch(e) {
    debug(e)
  }
}

function* notifyPatient(accountId, phoneNo, email, text) {
  debug(`Notifying Patient of ${accountId} via ${phoneNo}: ${text}`)

  yield sendSMS(phoneNo, text)

  const emailData = {
    title: 'MDOCS Appointments',
    message: text,
    adminUrl: undefined
  }
  try {
    if (email) {
      yield sendAppointmentEmail(email, emailData)
    }
  }
  catch(e) {
    debug(e)
  }
}

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

  yield notifyPracticeAdmins(requestObject.account_id, `New appointment for ${requestObject.form_name}, ${requestObject.form_phone}`)
  yield notifyPatient(requestObject.account_id, requestObject.form_phone, requestObject.patient_email, 'Your appointment has been accepted for review. We will contact you shortly.')
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
    return item.visit_date && item.visit_date.isBefore(overviewStart)
  })

  this.body = {
    overview: {
      timeSlot: {
        start: overviewStart.unix(),
        end: moment().unix()
      },
      data: overviewEvents
    },
    data: allItems
  }
});

router.post('/confirm', function*() {
  const appointment = yield appointmentById(this.request.body.id)
  if (!appointment) {
    this.status = 404
    this.body = {err: 'Not Found'}
  }
  const updated = {
    ...appointment,
    status: 'confirm',
    id: undefined
  }

  yield updateAppointment(this.request.body.id, updated)

  yield notifyPatient(appointment.account_id, appointment.patient_phone, appointment.patient_email,
    'Your appointment with Dr. Sarah Smith has been confirmed!')

  updated.patient_dob = appointment.patient_dob ? moment.unix(appointment.patient_dob) : undefined,
  updated.visit_date = appointment.visit_date ? moment.unix(appointment.visit_date) : undefined

  this.body = {...updated, id: this.request.body.id}
})


module.exports = router;
