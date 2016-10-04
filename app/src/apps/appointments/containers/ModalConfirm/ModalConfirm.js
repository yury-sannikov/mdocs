import React, { Component } from 'react'
import Modal from 'react-modal'

class ModalConfirm extends Component {
  render() {
    const customStyles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 9999
      }
    }
    const { onHide, onConfirm } = this.props
    return (
      <div>
        <Modal
          className='Modal__Bootstrap modal-dialog modal-dialog-popout'
          closeTimeoutMS={150}
          style={customStyles}
          isOpen={this.props.isOpen}
          onRequestClose={onHide}
        >
          <div className='modal-content'>
            <div className='block block-themed block-transparent remove-margin-b'>
              <div className='block-header bg-primary-dark'>
                <ul className='block-options'>
                  <li>
                    <button type='button' onClick={onHide}>
                      <i className='si si-close' />
                    </button>
                  </li>
                </ul>
                <h4 className='block-title'>{this.props.title}</h4>
              </div>
              <div className='block-content'>
                {this.props.children}
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-default' onClick={onHide}>Close</button>
              <button type='button' className='btn btn-primary' onClick={onConfirm}>{this.props.confirmCaption}</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

ModalConfirm.propTypes = {
  isOpen: React.PropTypes.bool,
  onHide: React.PropTypes.func,
  onConfirm: React.PropTypes.func,
  title: React.PropTypes.string,
  confirmCaption: React.PropTypes.string,
  children: React.PropTypes.any
}

export default ModalConfirm
