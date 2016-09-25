import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

const buildBreadcrumbs = (path, pathMap) => {
  let crumbs = `root${path}`.split('/')
  if (_.isEmpty(_.last(crumbs))) {
    if (path === '/') {
      crumbs[crumbs.length - 1] = '/'
    } else {
      crumbs.splice(crumbs.length - 1, 1)
    }
  }
  crumbs.reverse()
  return crumbs.map(item => ({title: pathMap[item].title, url: pathMap[item].url}))
}

class NavHeader extends Component {

  renderCrumb (crumb) {
    return (
      <li key={crumb.title}>
        {crumb.url ? (
          <a href={crumb.url} className="link-effect">{crumb.title}</a>
        ) : (<span>{crumb.title}</span>)
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
    const { path, pathToNavHeaderMapping } = this.props.route
    const { title } = pathToNavHeaderMapping[path] || `todo: ${path}`
    const crumbs = buildBreadcrumbs(path, pathToNavHeaderMapping)
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
  route: React.PropTypes.object
}

export default connect((state, props) => {
  return {
    routing_ddd: state
  }
}, dispatch => bindActionCreators({ }, dispatch))(NavHeader)

