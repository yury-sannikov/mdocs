import React, { Component } from 'react'
import { Link } from 'react-router'
import { asyncConnect } from 'redux-async-connect'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    return Promise.resolve(true)
  }
}])
export default class Main extends Component {
  render () {
    return (
      <div>
        // <span>{'Main Container'}</span>
        // <Link to='/app/dashboard/about'>Abouts</Link>
      </div>
    )
  }
}
