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
import { formatPhone } from '../belt'
// import { sendStripeCallbackToSlack } from '../comm';

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

function massageRequestObject(requestObject) {
  let obj = {
    firstname: requestObject.firstname || requestObject.form_name,
    lastname: requestObject.lastname || '',
    fullname: requestObject.fullname || '',
    isnew: requestObject.isnew || (requestObject.form_name_new === 'yes'),
    email: requestObject.email,
    phone: requestObject.phone || requestObject.form_phone,
    zip: requestObject.zip || '',
    comment: requestObject.comment || '',
    description: requestObject.description || requestObject.form_reason,
    systype: requestObject.systype || 'appointment',
    dob: requestObject.dob || requestObject.form_dob,
    visitdate: requestObject.visitdate || requestObject.form_date
  }
  obj.dob = moment(obj.dob || '', 'MM/DD/YYYY')
  obj.dob = obj.dob.isValid() ? obj.dob.utc().unix() : 0

  obj.visitDate = moment(obj.visitDate || '', 'MM/DD/YYYY hh:m a')
  obj.visitDate = obj.visitDate.isValid() ? obj.visitDate.utc().unix() : 0

  if (!obj.fullname) {
    obj.fullname = obj.firstname;
    if (obj.lastname) {
      if (obj.fullname) { obj.fullname = obj.fullname + ' ' }
      obj.fullname = obj.fullname + obj.lastname
    }
  }

  return obj
}

router.post('/', function*() {
  const requestObject = _.isArray(this.request.body) ?
    _.fromPairs(_.map(this.request.body, o => ([o.name, o.value]))) :
    this.request.body;


  if (!requestObject.account_id) {
    throw new Error('Unknown account ID')
  }


  let obj = massageRequestObject(requestObject)
  const { visitDate } = obj
  delete obj.visitDate;
  const id = yield createNewAppointment(requestObject.account_id, visitDate, obj)

  yield notifyPracticeAdmins(requestObject.account_id,
    `New appointment for ${obj.fullname}, ${formatPhone(obj.phone)}`)
  yield notifyPatient(requestObject.account_id, obj.phone, obj.email, 'Your appointment has been accepted for review. We will contact you shortly.')
  this.body = { ok: 1, id: id};
});

router.get('/dashboard', function*() {

  const allItems = (yield appointmentsForAccount(this.currentUser.account_id))
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
