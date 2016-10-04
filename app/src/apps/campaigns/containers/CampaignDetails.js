import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CampaignDetailsHeader from './CampaignDetails/Header'
import CampaignDetailsEditor from './CampaignDetails/Editor'
import CampaignDetailsAssets from './CampaignDetails/Assets'
class CampaignDetails extends Component {
  render () {
    return (
      <div className='content content-boxed'>
        <CampaignDetailsHeader params={this.props.params} />
        <CampaignDetailsEditor params={this.props.params} />
        <CampaignDetailsAssets params={this.props.params} />
      </div>
    )
  }
}

CampaignDetails.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default connect((state, props) => {
  return {
    state: state
  }
}, dispatch => bindActionCreators({ }, dispatch))(CampaignDetails)

