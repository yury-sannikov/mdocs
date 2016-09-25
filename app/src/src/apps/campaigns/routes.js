import React from 'react'
import { Route, IndexRoute } from 'react-router'

import {
    App,
    Campaigns
  } from './containers'

const pathToNavHeaderMapping = {
  'root': {
    title: 'Dashboard',
    url: '/app'
  },
  '/': {
    title: 'Campaigns'
  }
}

export default (store) => {
  return (
    <Route path='/' component={App} pathToNavHeaderMapping={pathToNavHeaderMapping}>
      <IndexRoute component={Campaigns} />
    </Route>
  )
}
