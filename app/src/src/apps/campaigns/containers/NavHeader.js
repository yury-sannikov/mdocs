import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const buildBreadcrumbs = (path, pathMap) => {

}

class NavHeader extends Component {
  render () {
    const { path, pathToNavHeaderMapping } = this.props.route
    const { title } = pathToNavHeaderMapping[path] || `todo: ${path}`

    return (
      <div className="content bg-gray-lighter">
        <pre>
          {JSON.stringify(this.props, null, 2)}
        </pre>
        <div className="row items-push">
          <div className="col-sm-7">
            <h1 className="page-heading">{title}</h1>
          </div>
          <div className="col-sm-5 text-right hidden-xs">
            <ol className="breadcrumb push-10-t">
              <li>
                <a href="1" className="link-effect">Link1</a>
              </li>
              <li>
                <a href="2" className="link-effect">Link2</a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    )
  }
}

NavHeader.propTypes = {
  navMapping: React.PropTypes.object
}

export default connect((state, props) => {
  return {
    routing_ddd: state
  }
}, dispatch => bindActionCreators({ }, dispatch))(NavHeader)

