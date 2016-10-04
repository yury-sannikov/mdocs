import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class CampaignNew extends Component {
  render () {
    return (
      <div className="js-wizard-simple block">
        <ul className="nav nav-tabs nav-justified">
          <li className="active">
            <a href="#simple-classic-progress-step1" data-toggle="tab" aria-expanded="true">1. Personal</a>
          </li>
          <li className="">
            <a href="#simple-classic-progress-step2" data-toggle="tab" aria-expanded="false">2. Details</a>
          </li>
          <li className="">
            <a href="#simple-classic-progress-step3" data-toggle="tab" aria-expanded="false">3. Extra</a>
          </li>
        </ul>
        <form className="form-horizontal" action="base_forms_wizard.html" method="post">
          <div className="block-content block-content-mini block-content-full border-b">
            <div className="wizard-progress progress progress-mini remove-margin-b">
              <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '33.3333%'}} />
            </div>
          </div>
          <div className="block-content tab-content">
            <div className="tab-pane fade fade-up push-30-t push-50 active in" id="simple-classic-progress-step1">
              <div className="form-group">
                <div className="col-sm-8 col-sm-offset-2">
                  <label htmlFor="simple-classic-progress-firstname">First Name</label>
                  <input className="form-control" type="text" id="simple-classic-progress-firstname" name="simple-classic-progress-firstname" placeholder="Please enter your firstname" />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-8 col-sm-offset-2">
                  <label htmlFor="simple-classic-progress-lastname">Last Name</label>
                  <input className="form-control" type="text" id="simple-classic-progress-lastname" name="simple-classic-progress-lastname" placeholder="Please enter your lastname" />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-8 col-sm-offset-2">
                  <label htmlFor="simple-classic-progress-email">Email</label>
                  <input className="form-control" type="email" id="simple-classic-progress-email" name="simple-classic-progress-email" placeholder="Please enter your email" />
                </div>
              </div>
            </div>
            <div className="tab-pane fade fade-up push-30-t push-50" id="simple-classic-progress-step2">
              <div className="form-group">
                <div className="col-sm-8 col-sm-offset-2">
                  <label htmlFor="simple-classic-progress-details">Details</label>
                  <textarea className="form-control" id="simple-classic-progress-details" name="simple-classic-progress-details" rows="9" placeholder="Share something about yourself" />
                </div>
              </div>
            </div>
            <div className="tab-pane fade fade-up push-30-t push-50" id="simple-classic-progress-step3">
              <div className="form-group">
                <div className="col-sm-8 col-sm-offset-2">
                  <label htmlFor="simple-classic-progress-city">City</label>
                  <input className="form-control" type="text" id="simple-classic-progress-city" name="simple-classic-progress-city" placeholder="Where do you live?" />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-8 col-sm-offset-2">
                  <label htmlFor="simple-classic-progress-skills">Skills</label>
                  <select className="form-control" id="simple-classic-progress-skills" name="simple-classic-progress-skills" size="1">
                    <option value="">Please select your best skill</option>
                    <option value="1">Photoshop</option>
                    <option value="2">HTML</option>
                    <option value="3">CSS</option>
                    <option value="4">JavaScript</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-8 col-sm-offset-2">
                  <label className="css-input switch switch-sm switch-primary" htmlFor="simple-classic-progress-terms">
                    <input type="checkbox" id="simple-classic-progress-terms" name="simple-classic-progress-terms" />
                    <span>Agree with the</span>
                    <a data-toggle="modal" data-target="#modal-terms" href="#">terms</a>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="block-content block-content-mini block-content-full border-t">
            <div className="row">
              <div className="col-xs-6">
                <button className="wizard-prev btn btn-default disabled" type="button"><i className="fa fa-arrow-left" /> Previous</button>
              </div>
              <div className="col-xs-6 text-right">
                <button className="wizard-next btn btn-default" type="button" style={{display: 'inline-block'}}>Next <i className="fa fa-arrow-right" />
                </button>
                <button className="wizard-finish btn btn-primary" type="submit" style={{display: 'none'}}>
                  <i className="fa fa-check" />Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

CampaignNew.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default connect((state, props) => {
  return {
    state: state
  }
}, dispatch => bindActionCreators({ }, dispatch))(CampaignNew)

