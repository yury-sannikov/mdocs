import React, { Component } from 'react'
import EventsNavigator from '../EventsNavigator/EventsNavigator'

export default class EventsSidebar extends Component {
  render () {
    return (
      <div className='navbar-collapse remove-padding collapse' id='tickets-nav' aria-expanded='false' style={{height: '1px', 'backgroundColor': 'white'}}>
        <EventsNavigator />
      </div>
    )
  }
}
