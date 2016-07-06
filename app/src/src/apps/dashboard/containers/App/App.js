import React, { Component, PropTypes } from 'react';
import Promise from 'bluebird';

export default class App extends Component {

  render() {
    const styles = require('./App.scss');
    return (
      <div className={styles.appContent}>
        {this.props.children}
      </div>
    );
  }
}
