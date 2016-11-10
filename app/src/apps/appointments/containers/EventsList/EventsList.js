import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import moment from 'moment'
import ModalConfirm from '../ModalConfirm/ModalConfirm'
import {deleteAppointment, confirmAppointment} from '../../redux/modules/dashboard'

class EventsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDeleting: false,
      isConfirming: false,
      deleteItem: {},
      confirmItem: {}
    }
  }

  renderTableHeader() {
    const {events} = this.props
    return (
      <div className='block-header bg-gray-lighter'>
        {this.props.loading ? (
          <div className='block-title text-normal'>
            <i className='fa fa-sun-o fa-spin' />
          </div>
        ) : (
        <div className='block-title text-normal'>
          <strong>{`${events.length} — ${events.length}`}</strong>
          <span className='font-w400'>&nbsp;{'from'}&nbsp;</span>
          <strong>{'1'}</strong>
        </div>
        )}
      </div>
    )
  }

  render() {
    const hideDeleteModal = () => {
      this.setState({isDeleting: false})
    }
    const confirmDelete = () => {
      hideDeleteModal()
      this.props.deleteAppointment(this.state.deleteItem.id)
    }
    const hideConfirmModal = () => {
      this.setState({isConfirming: false})
    }
    const confirmConfirm = () => {
      hideConfirmModal()
      this.props.confirmAppointment(this.state.confirmItem.id)
    }
    return (
      <div className='block'>
        <ModalConfirm
          isOpen={this.state.isDeleting}
          onHide={hideDeleteModal}
          onConfirm={confirmDelete}
          title={'Delete Appointment'}
          confirmCaption={'Delete'}>
          <h4>Are you sure to delete appointment?</h4>
          <p>Please confirm deleting appointment with {this.state.deleteItem.patient_name}</p>
        </ModalConfirm>
        <ModalConfirm
          isOpen={this.state.isConfirming}
          onHide={hideConfirmModal}
          onConfirm={confirmConfirm}
          title={'Confirm Appointment'}
          confirmCaption={'Confirm'}>
          <h4>Are you sure?</h4>
          <p>Are you sure to appointment with {this.state.confirmItem.patient_name}
            on {this.renderVisitDate(this.state.confirmItem.visit_date)}</p>
        </ModalConfirm>
        {this.renderTableHeader()}
        {this.props.loaded ? this.renderTable() : <span />}
      </div>
    )
  }

  renderTable() {
    const {events} = this.props
    return (
      <div className='block-content animated fadeIn'>
        <div className='pull-r-l'>
          <table className='table table-hover table-vcenter'>
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

  renderTableRow(item) {
    const styles = require('./EventList.scss')
    const showDeleteModal = (deleteItem) => () => {
      this.setState({isDeleting: true, deleteItem})
    }
    const showConfirmModal = (confirmItem) => () => {
      this.setState({isConfirming: true, confirmItem})
    }
    return (
      <tr key={item.id}>
        <td className='font-w600 text-center' style={{'width': '120px'}}>
          <a href={`#/reschedule/${item.id}`}>
            {this.renderVisitDate(item.visit_date)}
          </a>
          <div className='text-muted'>
            <em
              style={{'font-size': 'x-small'}}>{moment.utc(+item.createdDate, 'X').local().format('MM/DD/YY h:mma')}</em>
          </div>
        </td>
        <td className='hidden-xs hidden-sm hidden-md text-center' style={{width: '100px'}}>
          {item.visit_date ? (
            <button onClick={showConfirmModal(item)}
              className={'btn btn-xs btn-info push-5-r push-10 ' + styles.actionButtonClass} type='button'>
              <i className='fa fa-check' />{' Confirm'}
            </button>
          ) : (
          <button onClick={showDeleteModal(item)}
            className={'btn btn-xs btn-danger push-5-r push-10 ' + styles.actionButtonClass} type='button'>
            <i className='fa fa-times' />{' Delete'}
          </button>
          )}
        </td>
        <td>
          <a className='font-w600' data-toggle='modal' data-target='#modal-ticket' href='#'>
            {`Appointment with ${item.fullname}`}
          </a>
          <div className='text-muted'>
            <span className={(item.isnew ? 'label label-success ' : 'label label-warning ') + styles.labelClass}>
              {item.isnew ? 'New' : 'Returning'}
            </span>
            <em>{`${this.formatPhone(item.phone)}`}</em>{`, ${item.description || item.comment || '-no reason specified-'}`}
          </div>
        </td>
        <td className='hidden-xs hidden-sm hidden-md text-muted' style={{'width': '120px'}}>
          <em>{item.profile.name}</em>
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
  loading: React.PropTypes.bool,
  deleteAppointment: React.PropTypes.func,
  confirmAppointment: React.PropTypes.func
}

const PATH_TO_STATE = {
  unconfirmed: 'new',
  upcoming: 'confirm',
  all: 'all'
}
export default connect((state, {route}) => {
  const {path} = route
  const status = PATH_TO_STATE[path]

  const {loaded, loading, data = {data: []}} = state.dashboard
  const overviewEvents = data.data.filter(item => status === 'all' || item.status === status)
  return {
    events: overviewEvents || [],
    loaded,
    loading
  }
}, dispatch => bindActionCreators({deleteAppointment, confirmAppointment}, dispatch))(EventsList)

