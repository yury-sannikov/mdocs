import React, { Component } from 'react'
import { asyncConnect } from 'redux-async-connect'

@asyncConnect([])
export default class Main extends Component {
  render () {
    return (
      <span>{'About'}</span>
    )
  }
}
