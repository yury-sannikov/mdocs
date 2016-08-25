import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class EventsNavigator extends Component {
  renderCog () { return (<span>&nbsp;&nbsp;</span>) }
  render () {
    const { router } = this.context
    const { loading, stats } = this.props
    return (
      <div className="block">
        <div className="block-header bg-gray-lighter">
          <ul className="block-options">
            <li>
              <button data-toggle="modal" data-target="#modal-compose" type="button">
                <i className="si si-settings" />
              </button>
            </li>
          </ul>
          <h3 className="block-title">{'Appointments'}

          </h3>
        </div>
        <div className="block-content">
          <ul className="nav nav-pills nav-stacked push">
            <li className={router.isActive('/events/unconfirmed') ? 'active' : ''}>
              <Link to={'/events/unconfirmed'}>
                <span className="badge pull-right">{loading ? this.renderCog() : stats.unconfirmedCount}</span>
                <i className="fa fa-fw fa-warning push-5-r" />{'Unconfirmed'}
              </Link>
            </li>
            <li className={router.isActive('/events/upcoming') ? 'active' : ''}>
              <Link to={'/events/upcoming'}>
                <span className="badge pull-right">{loading ? this.renderCog() : stats.upcomingCount}</span>
                <i className="fa fa-fw fa-inbox push-5-r" />{'Upcoming'}
              </Link>
            </li>
            <li className={router.isActive('/events/finished') ? 'active' : ''}>
              <Link to={'/events/finished'}>
                <span className="badge pull-right">{loading ? this.renderCog() : stats.finished}</span>
                <i className="fa fa-fw fa-folder-open-o push-5-r" />{'Finished'}
              </Link>
            </li>
            <li className={router.isActive('/events/all') ? 'active' : ''}>
              <Link to={'/events/all'}>
                <span className="badge pull-right">{loading ? this.renderCog() : stats.all}</span>
                <i className="fa fa-fw fa-folder-o push-5-r" />{'All'}
              </Link>
            </li>
          </ul>
        </div>
      </div>)
  }
}

EventsNavigator.contextTypes = {
  router: React.PropTypes.object.isRequired
}

EventsNavigator.propTypes = {
  stats: React.PropTypes.object,
  loaded: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  path: React.PropTypes.string // Not used except checking component pure status
}

export default connect((state, {route}) => {
  const { path } = route || {}
  const { loaded, loading, data: { stats = {} } = {} } = state.dashboard
  return { loaded, loading, stats, path }
})(EventsNavigator)
