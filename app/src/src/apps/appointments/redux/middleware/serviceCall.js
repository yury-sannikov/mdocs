import _ from 'lodash'

import { request, response, fail } from '../helpers'

const transform = (request, type, sideEffects) => response => ({payload: response, type, meta: {origin: request, sideEffects}})
const sideEffectsTransform = (sideEffects, index) => _.isArray(sideEffects) ? sideEffects.slice(index, index + 1) : sideEffects
const handlerDispatcher = (dispatch, request, sideEffects) => (type, index) => response => dispatch(transform(request, type, sideEffectsTransform(sideEffects, index))(response))

const SIDEEFFECT_SUCCESS_INDEX = 0
const SIDEEFFECT_FAIL_INDEX = 1

const requestMeta = {
  serviceCall: null,
  replayable: true,
  sideEffects: null
}

export const serviceMiddleware = (resolver) => (store) => (next) => (action) => {
  const serviceCall = _.get(action, 'meta.serviceCall')
  // ignore normal actions
  if (!serviceCall) {
    return next(action)
  }

  const { meta: { sideEffects } = {} } = action
  const handleFactory = handlerDispatcher(store.dispatch, action, sideEffects)

  let promise = null
  try {
    const service = resolver(serviceCall.service)

    if (!service) {
      throw Error(`service call middleware is unable to resolve service ${serviceCall.service}`)
    }

    const method = service[serviceCall.sel]

    if (typeof (method) !== 'function') {
      throw Error(`service call middleware is unable to find function ${serviceCall.service}.${serviceCall.sel}`)
    }

    store.dispatch(Object.assign({}, action, {type: request(action.type), meta: requestMeta}))

    const payload = _.isArray(action.payload) ? [...action.payload] : [action.payload]
    promise = method.apply(service, [...payload, action.meta])

    if (!promise || typeof (promise.then) !== 'function') {
      throw Error(`Service method ${serviceCall.service}.${serviceCall.sel} does not return promise.`)
    }
  } catch (error) {
    const errorString = `Middleware Service: ${serviceCall.service} call error: ${error.toString()}`
    handleFactory(fail(action.type), SIDEEFFECT_FAIL_INDEX)(Error(errorString))
    return
  }

  return promise
    .then(handleFactory(response(action.type), SIDEEFFECT_SUCCESS_INDEX))
    .catch(handleFactory(fail(action.type), SIDEEFFECT_FAIL_INDEX))
}
