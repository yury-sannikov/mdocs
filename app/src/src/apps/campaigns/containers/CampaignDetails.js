import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class CampaignDetails extends Component {
  render () {
    return (
      <div className="block">
        <div className="block-content block-content-full text-right">
          <button className="btn btn-success push-5-r push-20-t" type="button">
            <i className="fa fa-plus"></i>
            &nbsp;&nbsp;{'Test'}
          </button>
        </div>
        <div className="block-content block-content-full">
        </div>
      </div>
    )
  }
}

CampaignDetails.propTypes = {
  // route: React.PropTypes.object
}

export default connect((state, props) => {
  return {
    state: state
  }
}, dispatch => bindActionCreators({ }, dispatch))(CampaignDetails)

