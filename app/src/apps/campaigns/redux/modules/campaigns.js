import { createAction } from 'redux-actions'
import { serviceCallFactory, FETCH_SERVICE_NAME, request, response, fail } from '../helpers'
import moment from 'moment'

const LOAD_CAMPAIGNS = 'mdocs-campaigns/LOAD_CAMPAIGNS'

export const CAMPAIGN_UPCOMING = 0
export const CAMPAIGN_CURRENT = 1
export const CAMPAIGN_ARCHIVE = 2

const initialState = {
  loaded: false,
  loading: false,
  data: {
    [CAMPAIGN_UPCOMING]: [
      {
        id: 1,
        title: '$500 Off Complete Invisalign Package',
        description: '',
        startDate: moment('2017-03-01', 'YYYY-MM-DD'),
        endDate: moment('2017-03-31', 'YYYY-MM-DD')
      },
      {
        id: 2,
        title: '$99 New Patient Special',
        description: 'Includes X-rays, Exam, and Polish‎',
        startDate: moment('2017-06-01', 'YYYY-MM-DD'),
        endDate: moment('2017-06-30', 'YYYY-MM-DD')
      },
      {
        id: 3,
        title: '20% Off Any Dental Work',
        description: 'We Will Make You Smile with 20% Any Dental Work',
        startDate: moment('2017-09-01', 'YYYY-MM-DD'),
        endDate: moment('2017-09-30', 'YYYY-MM-DD')
      },
      {
        id: 4,
        title: '50% Teeth Whitening Treatment',
        description: '',
        startDate: moment('2017-12-01', 'YYYY-MM-DD'),
        endDate: moment('2017-12-31', 'YYYY-MM-DD')
      }
    ],
    [CAMPAIGN_CURRENT]: [
      {
        id: 5,
        title: '24/7 Emergency Dentist No Extra Fees',
        description: '',
        startDate: moment('2016-09-01', 'YYYY-MM-DD'),
        endDate: moment('2016-09-30', 'YYYY-MM-DD')
      },
      {
        id: 6,
        title: '$49 New Child Patient',
        description: 'Cleaning, Exams and X-Ray',
        startDate: moment('2016-09-01', 'YYYY-MM-DD'),
        endDate: moment('2016-10-31', 'YYYY-MM-DD')
      },
      {
        id: 7,
        title: '10% Off Cosmetic and Restorative Dental Services',
        description: '',
        startDate: moment('2016-09-01', 'YYYY-MM-DD'),
        endDate: moment('2016-11-30', 'YYYY-MM-DD')
      },
      {
        id: 8,
        title: '$100 Credit for Any Dental Service Over $1000',
        description: '',
        startDate: moment('2016-09-01', 'YYYY-MM-DD'),
        endDate: moment('2016-12-31', 'YYYY-MM-DD')
      }
    ],
    [CAMPAIGN_ARCHIVE]: [
      {
        id: 20,
        title: '$25 Credit Towards Any Dental Service',
        description: '',
        startDate: moment('2016-07-16 10:00', 'YYYY-MM-DD HH:mm'),
        endDate: moment('2017-08-01 11:30', 'YYYY-MM-DD HH:mm')
      },
      {
        id: 21,
        title: '$57 New Patient Appreciation Sale',
        description: 'Cleaning, Exams and X-Ray',
        startDate: moment('2016-06-16 10:00', 'YYYY-MM-DD HH:mm'),
        endDate: moment('2017-07-01 14:30', 'YYYY-MM-DD HH:mm')
      },
      {
        id: 22,
        title: '20% Off All Crown Services Labor Day Savings',
        description: '',
        startDate: moment('2016-06-16 10:00', 'YYYY-MM-DD HH:mm'),
        endDate: moment('2017-07-01 14:30', 'YYYY-MM-DD HH:mm')
      }
    ]
  }
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case request(LOAD_CAMPAIGNS):
      return {
        ...state,
        loading: true
      }
    case response(LOAD_CAMPAIGNS):
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...action.payload
        }
      }
    case fail(LOAD_CAMPAIGNS):
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

export const loadCampaigns = createAction(
  LOAD_CAMPAIGNS,
  null,
  serviceCallFactory(FETCH_SERVICE_NAME, 'loadCampaigns'))
