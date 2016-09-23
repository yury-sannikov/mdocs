import React from 'react'
import { Route } from 'react-router'

import {
    App
  } from './containers'

const pathToNavHeaderMapping = {
  '/': {
    title: 'Campaigns'
  }
}

export default (store) => {
  return (
    <Route path='/' component={App} pathToNavHeaderMapping={pathToNavHeaderMapping} />
  )
}
