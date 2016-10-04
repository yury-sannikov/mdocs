import React, { Component } from 'react'

export default class Main extends Component {

  renderTableHeader () {
    return (
      <div className='block-header bg-gray-lighter'>
        <h3 className='block-title'>{'Overview'}</h3>
      </div>
    )
  }
  render () {
    return (
      <div className='block'>
        {this.renderTableHeader()}
        <div className='block-content'>
          <div className='pull-r-l'>
            <table className='table table-hover table-vcenter'>
              <tbody>
                <tr>
                  <td className='hidden-xs hidden-sm hidden-md text-center' style={{width: '150px'}}>
                    <em>{'now'}</em>
                  </td>
                  <td>
                    <a className='font-w600' data-toggle='modal' data-target='#modal-ticket' href='#'>
                      <strong>{'John Anderson'}</strong>&nbsp;
                      {'Appointment with Dr. Hui Lee'}
                    </a>
                    <div className='text-muted'>
                      <em>{'(202) 233-0034'}</em>
                    </div>
                  </td>
                  <td className='hidden-xs hidden-sm hidden-md text-muted' style={{'width': '180px'}}>
                    <button className='btn btn-xs btn-success pull-right' type='button'>{'Survey'}</button>
                  </td>
                </tr>
                <tr>
                  <td className='hidden-xs hidden-sm hidden-md text-center' style={{width: '150px'}}>
                    <em>{'in 15 minutes'}</em>
                  </td>
                  <td>
                    <a className='font-w600' data-toggle='modal' data-target='#modal-ticket' href='#'>
                      <strong>{'Rebecca Gray'}</strong>&nbsp;
                      {'Appointment with Dr. Sarah Smith'}
                    </a>
                    <div className='text-muted'>
                      <em>{'(202) 823-5564'}</em>
                    </div>
                  </td>
                  <td className='hidden-xs hidden-sm hidden-md text-muted' style={{'width': '180px'}}>
                    <button className='btn btn-xs btn-info pull-right' type='button'>{'Cancel'}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>)
  }
}
