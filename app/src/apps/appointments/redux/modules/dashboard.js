import { createAction } from 'redux-actions'
import { serviceCallFactory, FETCH_SERVICE_NAME, request, response, fail } from '../helpers'

const LOAD_DASHBOARD = 'mdocs-appointment/LOAD_DASHBOARD'
const DELETE_APPOINTMENT = 'mdocs-appointment/DELETE_APPOINTMENT'
const CONFIRM_APPOINTMENT = 'mdocs-appointment/CONFIRM_APPOINTMENT'

const initialState = {
  loaded: false,
  loading: false,
  data: {
    data: []
  }
}

const STAT_MAP = {
  'new': 'unconfirmedCount',
  'confirm': 'upcomingCount',
  'discharge': 'finished'
}
const makeStats = (allItems) => allItems.reduce((res, item) => {
  res.all = res.all + 1
  const mapped = STAT_MAP[item.status]
  mapped && (res[mapped] = res[mapped] + 1)
  return res
}, {
  unconfirmedCount: 0,
  upcomingCount: 0,
  finished: 0,
  all: 0
})

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
        data: {
          ...action.payload,
          stats: makeStats(action.payload.data)
        }
      }
    case fail(LOAD_DASHBOARD):
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.payload
      }
    case request(CONFIRM_APPOINTMENT):
      return {
        ...state,
        loading: true,
        loaded: true
      }
    case fail(CONFIRM_APPOINTMENT):
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.payload
      }
    case response(CONFIRM_APPOINTMENT):
      {
        const idx = state.data.data.findIndex(item => item.id === action.payload.id)
        if (idx >= 0) {
          const data = [
            ...state.data.data.slice(0, idx),
            action.payload,
            ...state.data.data.slice(idx + 1)
          ]
          return {
            ...state,
            loading: false,
            loaded: true,
            data: {
              data: data,
              stats: makeStats(data)
            }
          }
        }
        break
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
