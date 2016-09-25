import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

const buildBreadcrumbsTitle = (routes, params, pathMap) => {
  let crumbs = _.last(routes).breadcrumbs
  crumbs = _.compact(crumbs.map(item => {
    if (!pathMap[item]) {
      return null
    }
    return {
      title: pathMap[item].title,
      url: pathMap[item].url
    }
  }))

  crumbs.reverse()
  return {
    crumbs,
    title: _.first(crumbs).title
  }
}

class NavHeader extends Component {

  renderLink (crumb) {
    const absolute = crumb.url[0] === '~'
    return absolute ? (
      <a href={crumb.url.slice(1)}>{crumb.title}</a>) : (
      <Link to={crumb.url}>{crumb.title}</Link>)
  }
  renderCrumb (crumb) {
    return (
      <li key={crumb.title}>
        {crumb.url ? this.renderLink(crumb) : (<span>{crumb.title}</span>)
        }
      </li>
    )
  }
/*
        <pre>
          {JSON.stringify(this.props, null, 2)}
        </pre>

*/
  render () {
    const { route: { routes, params, route: { pathToNavHeaderMapping } } } = this.props
    const { crumbs, title } = buildBreadcrumbsTitle(routes, params, pathToNavHeaderMapping)
    return (
      <div className="content bg-gray-lighter">
        <div className="row items-push">
          <div className="col-sm-7">
            <h1 className="page-heading">{title}</h1>
          </div>
          <div className="col-sm-5 text-right hidden-xs">
            <ol className="breadcrumb push-10-t">
              {crumbs.map(item => this.renderCrumb(item))}
            </ol>
          </div>
        </div>
      </div>
    )
  }
}

NavHeader.propTypes = {
  route: React.PropTypes.object,
  routingInfo: React.PropTypes.object
}

export default connect((state, props) => {
  return {
    routingInfo: state.routing
  }
}, dispatch => bindActionCreators({ }, dispatch))(NavHeader)

