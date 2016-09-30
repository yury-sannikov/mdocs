import React from 'react'
import { IndexRoute, Route } from 'react-router'

import {
    App,
    Home,
    About
  } from './containers'

export default (store) => {
  return (
    <Route path='/app/dashboard' component={App}>
      <IndexRoute component={Home} />
      <Route path='about' component={About} />
      {/* Catch all route */}
      <Route path='*' component={Home} status={404} />
    </Route>
  )
}
