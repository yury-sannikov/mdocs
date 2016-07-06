import { createStore as _createStore, applyMiddleware } from 'redux';
// import createMiddleware from './middleware/clientMiddleware';
import { routerMiddleware } from 'react-router-redux';

export default function createStore(history, client, data) {
  const reduxRouterMiddleware = routerMiddleware(history);
  const middleware = [reduxRouterMiddleware];
  const finalCreateStore = applyMiddleware(...middleware)(_createStore);
  const reducer = require('./reducers/reducer');
  const store = finalCreateStore(reducer, data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducers/reducer', () => {
      store.replaceReducer(require('./reducers/reducer'));
    });
  }
  return store;
}
