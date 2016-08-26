import React, { Component } from 'react'
import Modal from 'react-modal'

/*global alert*/

class DeleteModal extends Component {

  constructor(props) {
    super(props)
    this.state = { modalIsOpen: false }
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  handleModalCloseRequest() {
    this.setState({modalIsOpen: false})
  }

  handleSaveClicked(e) {
    alert('Save button was clicked')
  }

  render() {
    const customStyles = {
      overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(0, 0, 0, 0.75)',
        zIndex            : 9999
      }
    }
    return (
      <div>
        <button onClick={this.openModal.bind(this)}>Open Modal</button>
        <Modal
          className="Modal__Bootstrap modal-dialog modal-dialog-popout"
          closeTimeoutMS={150}
          style={customStyles}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest.bind(this)}
        >
          <div className="modal-content">
            <div className="block block-themed block-transparent remove-margin-b">
              <div className="block-header bg-primary-dark">
                <ul className="block-options">
                  <li>
                    <button type="button" onClick={this.handleModalCloseRequest.bind(this)}>
                      <i className="si si-close" />
                    </button>
                  </li>
                </ul>
                <h4 className="block-title">Modal title</h4>
              </div>
              <div className="block-content">
                <h4>Really long content...</h4>
                <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this.handleModalCloseRequest.bind(this)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={this.handleSaveClicked.bind(this)}>Save changes</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default DeleteModal
