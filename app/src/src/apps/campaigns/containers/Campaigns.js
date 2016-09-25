import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CampaignsList from './CampaignsList'
import { CAMPAIGN_UPCOMING, CAMPAIGN_CURRENT, CAMPAIGN_ARCHIVE } from '../redux/modules/campaigns'

class Campaigns extends Component {
  render () {
    return (
      <div className="block">
        <div className="block-content block-content-full">
          <CampaignsList campaignType={CAMPAIGN_UPCOMING} />
          <CampaignsList campaignType={CAMPAIGN_CURRENT} />
          <CampaignsList campaignType={CAMPAIGN_ARCHIVE} />
        </div>
      </div>
    )
  }
}

Campaigns.propTypes = {
  // route: React.PropTypes.object
}

export default connect((state, props) => {
  return {
    state: state
  }
}, dispatch => bindActionCreators({ }, dispatch))(Campaigns)

