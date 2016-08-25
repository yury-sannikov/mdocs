import { FETCH_SERVICE_NAME } from './redux/helpers'
import 'whatwg-fetch'
/*global fetch*/

const requestHeaders = (identity = null) => {
  const authorizationHeader = identity ? {authorization: identity.auth_token} : {}
  return {
    'Content-Type': 'application/json',
    ...authorizationHeader
  }
}

const API_CALL_TIMEOUT = 15000
const isDev = process.env.NODE_ENV !== 'production'
const API_URL = isDev ? 'http://localhost:3030/app/api' : 'https://app.mdocs.co/app/api'

const parseJSON = (response) => response.json()

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    error.response = response
    error.httpError = true
    throw error
  }
}

class FetchService {

  constructor() {
    console.log(`FetchService with API_URL ${API_URL}`)
  }

  executeRequest(payload, meta, url, fetchFactory) {
    const { identity = null } = meta
    let fetchParams = fetchFactory ? fetchFactory(payload, meta) : {}
    fetchParams.headers = requestHeaders(identity)
    fetchParams.method = fetchParams.method || 'GET'
    fetchParams.credentials = 'include'

    return new Promise((resolve, reject) => {
      const timerId = setTimeout(() => {
        let err = new Error('Network Timeout')
        err.errorDetails = 'We are unable to retrieve the information you requested.'
        reject(err)
      }, API_CALL_TIMEOUT)

      const stopTimeout = ((timerId) => (response) => {
        console.log(`stopTimeout for ${timerId}`)
        clearTimeout(timerId)
        return response
      })(timerId)

      console.log(`fetching ${url} ${fetchParams}`)

      fetch(url, fetchParams)
        .then(stopTimeout, stopTimeout)
        .then(checkStatus)
        .then(parseJSON)
        .then(resolve)
        .catch(reject)
    })
  }

  loadDashboard(payload, meta) {
    return this.executeRequest(payload, meta, `${API_URL}/appointment/dashboard`)
  }

}

const SERVICES = {
  [FETCH_SERVICE_NAME]: new FetchService()
}

export const resolver = (serviceName) => SERVICES[serviceName]
