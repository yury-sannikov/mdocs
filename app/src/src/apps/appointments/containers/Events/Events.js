import React, { Component } from 'react'
import { asyncConnect } from 'redux-async-connect'
import EventsSidebar from '../EventsSidebar/EventsSidebar'
import UpcomingEvents from '../UpcomingEvents/UpcomingEvents'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    return Promise.resolve(true)
  }
}])
export default class Main extends Component {
  render () {
    const { sidebar, content } = this.props
    return (
      <div>
        {/*
        <div className="row">
          <div className="col-sm-12 col-lg-12">
            <UpcomingEvents />
          </div>
        </div>
        */}
        <div className="row">
          <div className="col-sm-5 col-lg-3">
            <EventsSidebar />
            {sidebar}
          </div>
          <div className="col-sm-7 col-lg-9">
            {content}
          </div>
        </div>
      </div>
    )
  }
}

Main.propTypes = {
  sidebar: React.PropTypes.object,
  content: React.PropTypes.object
}
