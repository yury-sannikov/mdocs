/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './redux/create'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { ReduxAsyncConnect } from 'redux-async-connect'
// import useScroll from 'react-router-scroll';
import getRoutes from './routes'
const _browserHistory = browserHistory // useScroll(() => browserHistory);
const dest = document.getElementById('content')
const client = { test: 2 }
const store = createStore(_browserHistory, client, window.__data)
const history = syncHistoryWithStore(_browserHistory, store)

// if (__DEVTOOLS__ && !window.devToolsExtension) {
//   const DevTools = require('./containers/DevTools/DevTools');
//   ReactDOM.render(
//     <Provider store={store} key="provider">
//       <div>
//         {component}
//         <DevTools />
//       </div>
//     </Provider>,
//     dest
//   );
// }
const filterDeferred = (item) => !item.deferred
const renderReduxAsync = (props) => {
  return <ReduxAsyncConnect
    {...props}
    helpers={{ test: 1 }}
    filter={filterDeferred}
  />
}
const component = (
  <Router render={renderReduxAsync} history={history}>
    {getRoutes(store)}
  </Router>
)

ReactDOM.render(
  <Provider store={store} key='provider'>
    {component}
  </Provider>,
  dest
)

if (process.env.NODE_ENV !== 'production') {
  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.')
  }
}
