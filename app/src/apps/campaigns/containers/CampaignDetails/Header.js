import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CAMPAIGN_UPCOMING, CAMPAIGN_CURRENT, CAMPAIGN_ARCHIVE } from '../../redux/modules/campaigns'

const IMAGE_URL = require('./assets/campaign-mobile.png')
class CampaignDetailsHeader extends Component {
  render () {
    const { campaign } = this.props
    return (
      <div className="block">
        <div className="block-content text-center overflow-hidden">
          <div className="push-15 push-30-t animated fadeInDown" style={{display: 'inline-block', width: '30%', paddingTop: '5em'}}>
            <h2 className="h4 font-w600 push-5">
              {campaign.title}
            </h2>
            <h3 className="h5 text-muted">{campaign.description}</h3>
          </div>
          <div className="push-15-b push animated text-center fadeInUp" style={{display: 'inline-block', width: '70%', float: 'right'}}>
            <img src={IMAGE_URL} alt="" style={{width: '60%'}} />
          </div>
        </div>
        <div className="block-content text-center bg-gray-lighter">
          <div className="row items-push text-uppercase">
            <div className="col-xs-6 col-sm-3">
              <div className="font-w700 text-gray-darker animated fadeIn">{'Appoinments'}</div>
              <a className="h2 font-w300 text-primary animated flipInX" href="javascript:void(0)">{'35'}</a>
            </div>
            <div className="col-xs-6 col-sm-3">
              <div className="font-w700 text-gray-darker animated fadeIn">{'Views'}</div>
              <a className="h2 font-w300 text-primary animated flipInX" href="javascript:void(0)">{'457'}</a>
            </div>
            <div className="col-xs-6 col-sm-3">
              <div className="font-w700 text-gray-darker animated fadeIn">{'Conversion Rate'}</div>
              <a className="h2 font-w300 text-primary animated flipInX" href="javascript:void(0)">{'7%'}</a>
            </div>
            <div className="col-xs-6 col-sm-3">
              <div className="font-w700 text-gray-darker animated fadeIn">{'Social Shares'}</div>
              <a className="h2 font-w300 text-primary animated flipInX" href="javascript:void(0)">{'15'}</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CampaignDetailsHeader.propTypes = {
  params: React.PropTypes.object,
  campaign: React.PropTypes.object
}

export default connect((state, { params }) => {
  const { campaignId } = params
  const get = (type) => state.campaigns.data[type].find(i => i.id === +campaignId)
  return {
    campaign: get(CAMPAIGN_UPCOMING) || get(CAMPAIGN_CURRENT) || get(CAMPAIGN_ARCHIVE)
  }
}, dispatch => bindActionCreators({ }, dispatch))(CampaignDetailsHeader)

