import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadDashboard } from '../../redux/modules/dashboard'

@connect(null,
  dispatch => bindActionCreators({ loadDashboard }, dispatch))
export default class App extends Component {
  componentWillMount () {
    this.props.loadDashboard()
  }

  render () {
    const styles = require('./App.scss')
    return (
      <div className={styles.appContent}>
        {this.props.children}
      </div>
    )
  }
}
App.propTypes = {
  children: React.PropTypes.element.isRequired,
  loadDashboard: React.PropTypes.func
}
