import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import DeleteModal from './DeleteModal'

class EventsList extends Component {
  renderTableHeader () {
    const { events } = this.props
    return (
      <div className="block-header bg-gray-lighter">
          {this.props.loading ? (
            <div className="block-title text-normal">
              <i className="fa fa-sun-o fa-spin"></i>
            </div>
          ) : (
            <div className="block-title text-normal">
              <strong>{`${events.length} — ${events.length}`}</strong>
              <span className="font-w400">&nbsp;{'from'}&nbsp;</span>
              <strong>{'1'}</strong>
            </div>
          )}
      </div>
    )
  }
  render () {
    return (
      <div className="block">
        <DeleteModal />
        {this.renderTableHeader()}
        {this.props.loaded ? this.renderTable() : <span />}
      </div>
    )
  }

  renderTable () {
    const { events } = this.props
    return (
      <div className="block-content animated fadeIn">
        <div className="pull-r-l">
          <table className="table table-hover table-vcenter">
            <tbody>
              {events.map(e => this.renderTableRow(e))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderVisitDate(date) {
    if (!date) {
      return (<em>{'Negotiate Date'}</em>)
    }
    return (<span>{moment(date, 'YYYY-MM-DD HH:mm Z').format('MMM D YYYY, h:mm a')}</span>)
  }

  formatPhone(phone) {
    var s2 = ('' + phone).replace(/\D/g, '')
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/)
    return (!m) ? null : `(${m[1]}) ${m[2]}-${m[3]}`
  }

  renderTableRow (item) {
    const styles = require('./EventList.scss')
    return (
      <tr key={item.id}>
        <td className="font-w600 text-center" style={{'width': '120px'}}>
          <a href={`#/reschedule/${item.id}`}>
            {this.renderVisitDate(item.visit_date)}
          </a>
        </td>
        <td className="hidden-xs hidden-sm hidden-md text-center" style={{width: '100px'}}>
          {item.visit_date ? (
            <button className={'btn btn-xs btn-info push-5-r push-10 ' + styles.actionButtonClass} type="button">
              <i className="fa fa-check" />{' Confirm'}
            </button>
            ) : (
            <button className={'btn btn-xs btn-danger push-5-r push-10 ' + styles.actionButtonClass} type="button">
              <i className="fa fa-times" />{' Delete'}
            </button>
            )}
        </td>
        <td>
          <a className="font-w600" data-toggle="modal" data-target="#modal-ticket" href="#">
            {`Appointment with ${item.patient_name}`}
          </a>
          <div className="text-muted">
            <span className={(item.patient_new ? 'label label-success ' : 'label label-warning ') + styles.labelClass}>
              {item.patient_new ? 'New' : 'Returning'}
            </span>
            <em>{`${this.formatPhone(item.patient_phone)}`}</em>{`, ${item.patient_reason || '-no reason specified-'}`}
          </div>
        </td>
        <td className="hidden-xs hidden-sm hidden-md text-muted" style={{'width': '120px'}}>
          <em>{'Dr. Sarah Smith'}</em>
        </td>
        {/*
        <td className="hidden-xs hidden-sm hidden-md text-center" style={{'width': '60px'}}>
          <span className="badge badge-primary">
            <i className="fa fa-comments-o" />{'5'}
          </span>
        </td>
        */}
      </tr>
    )
  }

}

EventsList.propTypes = {
  events: React.PropTypes.array,
  loaded: React.PropTypes.bool,
  loading: React.PropTypes.bool
}

export default connect((state, {route}) => {
  const { path } = route
  const { loaded, loading, data = {} } = state.dashboard
  return {
    events: data[path] || [],
    loaded,
    loading
  }
})(EventsList)

