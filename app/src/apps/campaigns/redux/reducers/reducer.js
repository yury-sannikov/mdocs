import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {reducer as reduxAsyncConnect} from 'redux-async-connect'

import {reducer as reduxForm} from 'redux-form'
import campaigns from '../modules/campaigns'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  reduxForm,
  campaigns
})
