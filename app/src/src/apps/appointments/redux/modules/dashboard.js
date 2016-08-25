import { createAction } from 'redux-actions'
import { serviceCallFactory, FETCH_SERVICE_NAME, request, response, fail } from '../helpers'

const LOAD_DASHBOARD = 'mdocs-appointment/LOAD_DASHBOARD'

const initialState = {
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
        data: action.result
      }
    case fail(LOAD_DASHBOARD):
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    default:
      return state
  }
}

export const loadDashboard = createAction(
  LOAD_DASHBOARD,
  null,
  serviceCallFactory(FETCH_SERVICE_NAME, 'loadDashboard'))
