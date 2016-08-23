import React, { Component } from 'react'

export default class Main extends Component {

  renderTableHeader () {
    return (
      <div className="block-header bg-gray-lighter">
        <div className="block-title text-normal">
          <strong>{'1-1'}</strong>
          <span className="font-w400">&nbsp;{'from'}&nbsp;</span>
          <strong>{'1'}</strong>
        </div>
      </div>
    )
  }
  render () {
    return (
      <div className="block">
        {this.renderTableHeader()}
        <div className="block-content">
          <div className="pull-r-l">
            <table className="table table-hover table-vcenter">
              <tbody>
                <tr>
                  {/* <td className="font-w600 text-center" style={{'width': '80px'}}>{'#TCK0011'}</td> */}
                  <td className="hidden-xs hidden-sm hidden-md text-center" style={{width: '100px'}}>
                    <span className="label label-success">{'New'}</span>
                  </td>
                  <td>
                    <a className="font-w600" data-toggle="modal" data-target="#modal-ticket" href="#">
                      {"Appointment with Dr. Sarah Smith"}
                    </a>
                    <div className="text-muted">
                      <em>{'2 hours ago'}</em>{' by '}<a href="javascript:void(0)">{'Rebecca Gray'}</a>
                    </div>
                  </td>
                  <td className="hidden-xs hidden-sm hidden-md text-muted" style={{'width': '120px'}}>
                    <em>{'Web Site'}</em>
                  </td>
                  <td className="hidden-xs hidden-sm hidden-md text-center" style={{'width': '60px'}}>
                    <span className="badge badge-primary">
                      <i className="fa fa-comments-o" />{'5'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>)
  }
}
