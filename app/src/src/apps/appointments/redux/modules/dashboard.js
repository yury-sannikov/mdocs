import { createAction } from 'redux-actions'
import { serviceCallFactory, FETCH_SERVICE_NAME, request, response, fail } from '../helpers'

const LOAD_DASHBOARD = 'mdocs-appointment/LOAD_DASHBOARD'
const DELETE_APPOINTMENT = 'mdocs-appointment/DELETE_APPOINTMENT'
const CONFIRM_APPOINTMENT = 'mdocs-appointment/CONFIRM_APPOINTMENT'

const initialState = {
  loaded: false,
  loading: false
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case request(LOAD_DASHBOARD):
      return {
        ...state,
        loading: true
      }
    case response(LOAD_DASHBOARD):
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      }
    case fail(LOAD_DASHBOARD):
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.payload
      }
    default:
      return state
  }
}

export const loadDashboard = createAction(
  LOAD_DASHBOARD,
  null,
  serviceCallFactory(FETCH_SERVICE_NAME, 'loadDashboard'))

export const deleteAppointment = createAction(
  DELETE_APPOINTMENT,
  id => ({id}),
  serviceCallFactory(FETCH_SERVICE_NAME, 'deleteAppointment'))

export const confirmAppointment = createAction(
  CONFIRM_APPOINTMENT,
  id => ({id}),
  serviceCallFactory(FETCH_SERVICE_NAME, 'confirmAppointment'))
