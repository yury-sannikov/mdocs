import React, { Component } from 'react'

export default class Main extends Component {
  render () {
    return (
      <div className='block'>
        <div className='block-header bg-gray-lighter'>
          <ul className='block-options'>
            <li>
              <button data-toggle='modal' data-target='#modal-compose' type='button'>
                <i className='si si-settings' />
              </button>
            </li>
          </ul>
          <h3 className='block-title'>{'Quick Actions'}</h3>
        </div>
        <div className='block-content'>
          <ul className='nav nav-pills nav-stacked push'>
            <li >
              <a href='#'>
                <i className='fa fa-fw fa-warning push-5-r' />{'Accept All'}
              </a>
            </li>
          </ul>
        </div>
      </div>)
  }
}

Main.contextTypes = {
  router: React.PropTypes.object.isRequired
}
