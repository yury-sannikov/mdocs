import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { loadDashboard } from '../../redux/modules/dashboard'

import NavHeader from '../NavHeader'

@connect(null,
  dispatch => bindActionCreators({  }, dispatch))
export default class App extends Component {
  componentWillMount () {
    //this.props.loadDashboard()
  }

  render () {
    const styles = require('./App.scss')
    return (
      <div className={styles.appContent}>
        <NavHeader route={this.props.route} />

        <span>{JSON.stringify(this.props.route)}</span>
        {/* this.props.children */}
      </div>
    )
  }
}
App.propTypes = {
//  pathToNavHeaderMapping: React.PropTypes.any
//  children: React.PropTypes.element.isRequired,
// loadDashboard: React.PropTypes.func
}
