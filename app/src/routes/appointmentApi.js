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
import { profileById } from '../db'
import { getProfiles } from '../db/profiles'
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

function* notifyPracticeAdmins(profileId, text) {
  debug(`Notifying Office Administrators of profile ${profileId}: ${text}`)

  let profile = yield profileById(profileId)
  profile = _.get(profile, '[0][0]', {})

  if (profile.phone) {
    yield sendSMS(profile.phone, text)
  } else {
    debug(`Profile ${profileId} has no phone associated`)
  }

  const emailData = {
    title: 'PacticeWin Appointments',
    message: text,
    adminUrl: 'https://app.mdocs.co/app/appointments'
  }
  try {
    if (profile.email) {
      yield sendAppointmentEmail(profile.email, emailData)
    } else {
      debug(`Profile ${profileId} has no email associated`)
    }
  }
  catch(e) {
    debug(e)
  }
}

function* notifyPatient(profileId, phoneNo, email, text) {
  debug(`Notifying Patient of ${profileId} via ${phoneNo}: ${text}`)

  yield sendSMS(phoneNo, text)

  const emailData = {
    title: 'PracticeWin Appointment',
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
  obj.createdDate = moment().utc().unix()

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


  if (!requestObject.profileId) {
    throw new Error('Unknown profile ID')
  }


  let obj = massageRequestObject(requestObject)
  const { visitDate } = obj
  delete obj.visitDate;
  const id = yield createNewAppointment(requestObject.profileId, visitDate, obj)

  yield notifyPracticeAdmins(requestObject.profileId,
    `New appointment for ${obj.fullname}, ${formatPhone(obj.phone)}`)
  yield notifyPatient(requestObject.profileId, obj.phone, obj.email, 'Your appointment has been accepted for review. We will contact you shortly.')
  this.body = { ok: 1, id: id};
});

router.get('/dashboard', function*() {
  const allProfiles = yield getProfiles(this.currentUser.account.profiles)

  const allAppointments = _.flatten(yield this.currentUser.account.profiles.map(p => appointmentsForAccount(p)))

  const allItems = allAppointments.map( i => {
      i.dob = i.dob ? moment.unix(i.dob) : undefined
      i.visit_date = i.visit_date ? moment.unix(i.visit_date) : undefined
      i.profile = allProfiles.find(p=>p.id == i.profile_id) || {}
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
    profiles: allProfiles,
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
