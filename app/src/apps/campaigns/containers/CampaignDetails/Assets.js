import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CAMPAIGN_UPCOMING, CAMPAIGN_CURRENT, CAMPAIGN_ARCHIVE } from '../../redux/modules/campaigns'

class CampaignDetailsAssets extends Component {
  render () {
    // const { campaign } = this.props
    return (
      <div className='block'>
        <div className='block-header bg-gray-lighter'>
          <h3 className='block-title'>Images</h3>
        </div>
        <div className='block-content block-content-full'>
          <div className='row'>
            <div className='col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3'>
              <form className='dropzone push-30-t push-30 dz-clickable' action='base_pages_ecom_product_edit.html'>
                <div className='dz-default text-center dz-message'>
                  <span>Drop files here to upload</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CampaignDetailsAssets.propTypes = {
  params: React.PropTypes.object,
  campaign: React.PropTypes.object
}

export default connect((state, { params }) => {
  const { campaignId } = params
  const get = (type) => state.campaigns.data[type].find(i => i.id === +campaignId)
  return {
    campaign: get(CAMPAIGN_UPCOMING) || get(CAMPAIGN_CURRENT) || get(CAMPAIGN_ARCHIVE)
  }
}, dispatch => bindActionCreators({ }, dispatch))(CampaignDetailsAssets)

