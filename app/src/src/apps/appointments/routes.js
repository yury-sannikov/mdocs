import React from 'react'
import { IndexRedirect, Route } from 'react-router'

import {
    App,
    Events,
    About,
    UnconfirmedSidebarBlock,
    EventsList
  } from './containers'

export default (store) => {
  return (
    <Route path='/' component={App}>
      <IndexRedirect to='events/unconfirmed' />
      <Route path='events' component={Events} >
        <IndexRedirect to='unconfirmed' />
        <Route path='unconfirmed' components={{sidebar: UnconfirmedSidebarBlock, content: EventsList}} />
        <Route path='upcoming' components={{sidebar: UnconfirmedSidebarBlock}} />
        <Route path='finished' components={{sidebar: UnconfirmedSidebarBlock}} />
        <Route path='all' components={{sidebar: UnconfirmedSidebarBlock}} />
      </Route>

      <Route path='about' component={About} />
      {/* Catch all route */}
      <Route path='*' component={App} status={404} />
    </Route>
  )
}
