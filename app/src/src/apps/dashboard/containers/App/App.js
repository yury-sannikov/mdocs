import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import Promise from 'bluebird';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    return Promise.delay(1);
  }
}])
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
