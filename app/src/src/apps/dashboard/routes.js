import React from 'react';
import {IndexRoute, Route} from 'react-router';

import {
    App,
    Home
  } from './containers';

export default (store) => {
  return (
    <Route path="/" component={ App }>
      <IndexRoute component={ Home }/>
      { /* Catch all route */ }
      <Route path="*" component={ Home } status={404} />
    </Route>
  );
};
