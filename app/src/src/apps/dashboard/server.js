import createHistory from 'react-router/lib/createMemoryHistory';
import createStore from './redux/create';
import { syncHistoryWithStore } from 'react-router-redux';
import { match } from 'react-router';
import getRoutes from './routes';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import {Provider} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/server';

export function render(ctx, locals) {
  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }
  const memoryHistory = createHistory(ctx.request.originalUrl);
  const store = createStore(memoryHistory, null, {});
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    ctx.render('app/dashboardReact', Object.assign({}, locals, {
      assets: webpackIsomorphicTools.assets()
    }), true);
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }
  return new Promise((resolve, reject) => {

    match({ history, routes: getRoutes(store), location: ctx.request.originalUrl }, (error, redirectLocation, renderProps) => {
      if (error) {
        return reject(error);
      }

      if (redirectLocation) {
        ctx.redirect(redirectLocation.pathname + redirectLocation.search);
        return resolve();
      }

      if (!renderProps) {
        ctx.redirect('/');
        return resolve();
      }

      loadOnServer({...renderProps, store, helpers: { test: 1} }).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );
        const content = ReactDOM.renderToString(component);

        let developmentStyles = '';
        if (Object.keys(webpackIsomorphicTools.assets().styles).length === 0) {
          developmentStyles = `${require('./containers/App/App.scss')._style}`;
        }

        ctx.render('app/dashboardReact', Object.assign({}, locals, {
          assets: webpackIsomorphicTools.assets(),
          serverPrerender: content,
          developmentStyles
        }), true);

        resolve();
      }, reject);

    });
  });

}
