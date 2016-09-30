export const request = (type) => `${type}_REQUEST`
export const response = (type) => `${type}_RESPONSE`
export const fail = (type) => `${type}_FAIL`

export const isRequest = (type) => type.endsWith('_REQUEST')
export const isResponse = (type) => type.endsWith('_RESPONSE')
export const isFail = (type) => type.endsWith('_FAIL')

export const FETCH_SERVICE_NAME = 'fetchService'

export const serviceCallFactory = (service, sel, authRequired = true) => {
  return (actions) => {
    return {
      serviceCall: {
        service,
        sel
      },
      authRequired,
      replayable: false
    }
  }
}

// const withSideEffectsAdapter = (actionCreator, ...sideEffect) => (...callArgs) => {

//   const sideEffectMapper = (effect) => {
//     if (typeof effect == 'function') {
//       let result = effect(...callArgs)
//       return (typeof result == 'function') ? result() : result
//     } else if (_.isArray(effect)) {
//       return _.map(effect, sideEffectMapper)
//     }
//     return effect
//   }

//   let mappedSideEffects = _.map(sideEffect, sideEffectMapper)
//   return withSideEffects(actionCreator(...callArgs), ...mappedSideEffects)
// }

