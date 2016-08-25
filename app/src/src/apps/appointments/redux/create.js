import { createStore as _createStore, applyMiddleware } from 'redux'
// import createMiddleware from './middleware/clientMiddleware';
import { routerMiddleware } from 'react-router-redux'
import createLogger from 'redux-logger'
import { serviceMiddleware } from './middleware/serviceCall'

export default function createStore(history, resolver, data) {
  const logger = createLogger({
    level: 'info',
    collapsed: true
  })

  const reduxRouterMiddleware = routerMiddleware(history)
  const middleware = [logger, serviceMiddleware(resolver), reduxRouterMiddleware]
  const finalCreateStore = applyMiddleware(...middleware)(_createStore)
  const reducer = require('./reducers/reducer')
  const store = finalCreateStore(reducer, data)

  // eslint-disable-next-line no-undef
  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducers/reducer', () => {
      store.replaceReducer(require('./reducers/reducer'))
    })
  }
  return store
}
