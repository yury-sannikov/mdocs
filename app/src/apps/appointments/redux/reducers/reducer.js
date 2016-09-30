import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {reducer as reduxAsyncConnect} from 'redux-async-connect'

import {reducer as reduxForm} from 'redux-form'
import dashboard from '../modules/dashboard'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  reduxForm,
  dashboard
})
