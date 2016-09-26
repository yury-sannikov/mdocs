import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CAMPAIGN_UPCOMING, CAMPAIGN_CURRENT, CAMPAIGN_ARCHIVE } from '../../redux/modules/campaigns'
import DatePicker from 'react-bootstrap-date-picker'
import moment from 'moment'

const DATE_FORMAT = moment.defaultFormat

class CampaignDetailsEditor extends Component {

  handleChange(newDate) {
    console.log('newDate', newDate)
  }
  onSubmit() {
    console.log('submit')
  }

  render () {
    const { campaign } = this.props
    const startDate = moment(campaign.startDate).format(DATE_FORMAT)
    const endDate = moment(campaign.endDate).format(DATE_FORMAT)
    return (
      <div className="block">
        <div className="block-header bg-gray-lighter">
          <h3 className="block-title">{'Edit Info'}</h3>
        </div>
        <div className="block-content block-content-full">
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2">
              <form className="form-horizontal push-30-t push-30" action="base_pages_ecom_product_edit.html" method="post" onSubmit={this.onSubmit}>
                <div className="form-group">
                  <div className="col-xs-12">
                    <div className="form-material form-material-primary">
                      <input className="form-control" type="text" id="campaign-title" name="product-id" value={campaign.title} />
                      <label htmlFor="campaign-title">Campaign Title</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-xs-12">
                    <div className="form-material form-material-primary">
                      <input className="form-control" type="text" id="campaign-description" name="product-name" value={campaign.description} />
                      <label htmlFor="campaign-description">Campaign Description</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-md-8">
                    <div className="form-material">
                      <DatePicker calendarPlacement={'top'} onChange={this.handleChange} placeholder="Start Date" value={startDate} id="campaign-start" />
                      <label htmlFor="campaign-start">Choose Start Date</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-md-8">
                    <div className="form-material">
                      <DatePicker calendarPlacement={'top'} onChange={this.handleChange} placeholder="End Date" value={endDate} id="campaign-end" />
                      <label htmlFor="campaign-end">Choose End Date</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-xs-12">
                    <button className="btn btn-sm btn-primary" type="submit">{'Save'}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CampaignDetailsEditor.propTypes = {
  params: React.PropTypes.object,
  campaign: React.PropTypes.object
}

export default connect((state, { params }) => {
  const { campaignId } = params
  const get = (type) => state.campaigns.data[type].find(i => i.id === +campaignId)
  return {
    campaign: get(CAMPAIGN_UPCOMING) || get(CAMPAIGN_CURRENT) || get(CAMPAIGN_ARCHIVE)
  }
}, dispatch => bindActionCreators({ }, dispatch))(CampaignDetailsEditor)

