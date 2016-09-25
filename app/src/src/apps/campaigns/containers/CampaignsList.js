import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CAMPAIGN_UPCOMING, CAMPAIGN_CURRENT, CAMPAIGN_ARCHIVE } from '../redux/modules/campaigns'

const CAMPAIGN_TITLES = {
  [CAMPAIGN_UPCOMING]: 'Upcoming',
  [CAMPAIGN_CURRENT]: 'Current',
  [CAMPAIGN_ARCHIVE]: 'Achived'
}
const CAMPAIGN_ICONS = {
  [CAMPAIGN_UPCOMING]: 'si-like',
  [CAMPAIGN_CURRENT]: 'si-rocket',
  [CAMPAIGN_ARCHIVE]: 'si-drawer'
}

class CampaignsList extends Component {
  render () {
    return (
      <table className="table table-striped table-borderless table-vcenter">
        <thead>
          {this.renderHead()}
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
      </table>
    )
  }

  renderHead () {
    const { campaigns, campaignType } = this.props
    const title = CAMPAIGN_TITLES[campaignType]

    const hasElementsHeader = (
      <tr>
        <th colSpan="2">{title}</th>
        <th className="text-center hidden-xs hidden-sm" style={{width: '180px'}}>{'Start Date'}</th>
        <th className="text-center hidden-xs hidden-sm" style={{width: '180px'}}>{'End Date'}</th>
      </tr>
    )
    const noElementsHeader = (
      <tr>
        <th colSpan="2">{title}</th>
      </tr>
    )
    return (campaigns && campaigns.length) ? hasElementsHeader : noElementsHeader
  }
  renderBody() {
    const { campaigns, campaignType } = this.props
    const icon = CAMPAIGN_ICONS[campaignType]

    const renderIcon = (
      <td className="text-center" style={{width: '75px'}}>
        <i className={`si fa-2x ${icon}`} />
      </td>
    )

    if (!campaigns || campaigns.length === 0) {
      return (
        <tr>
          {renderIcon}
          <td>
            <div className="font-s13 text-muted">No campaigns.</div>
          </td>
        </tr>
      )
    }
    return campaigns.map((c, i) => this.renderRow(c, renderIcon, i === 0))
  }

  renderRow(campaign, renderIcon, firstRow) {
    return (
      <tr key={campaign.id}>
        {firstRow ? renderIcon : (<td />)}
        <td>
          <h4 className="h5 font-w600 push-5">
            <a href="base_pages_forum_topics.html">{campaign.title}</a>
          </h4>
          <div className="font-s13 text-muted">{campaign.description}</div>
        </td>
        <td className="text-center hidden-xs hidden-sm">
          {campaign.startDate.format('MMMM Do, YYYY')}
        </td>
        <td className="text-center hidden-xs hidden-sm">
          {campaign.endDate.format('MMMM Do, YYYY')}
        </td>
      </tr>
    )
  }
}

CampaignsList.propTypes = {
  campaignType: React.PropTypes.number.isRequired,
  campaigns: React.PropTypes.array
}

export default connect((state, { campaignType }) => {
  return {
    campaigns: state.campaigns.data[campaignType]
  }
}, dispatch => bindActionCreators({ }, dispatch))(CampaignsList)

