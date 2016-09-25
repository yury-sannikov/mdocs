import React from 'react'
import { Route, IndexRoute } from 'react-router'

import {
    App,
    Campaigns,
    CampaignDetails
  } from './containers'

const pathToNavHeaderMapping = {
  'root': {
    title: 'Dashboard',
    url: '~/app'
  },
  'campaigns': {
    title: 'Campaigns',
    url: '/'
  },
  'campaign': {
    title: 'Campaign Details'
  }
}

export default (store) => {
  return (
    <Route path='/' component={App} pathToNavHeaderMapping={pathToNavHeaderMapping}>
      <IndexRoute breadcrumbs={['root', 'campaigns']} component={Campaigns} />
      <Route breadcrumbs={['root', 'campaigns', 'campaign']} path='/:campaignId' component={CampaignDetails} />
    </Route>
  )
}
