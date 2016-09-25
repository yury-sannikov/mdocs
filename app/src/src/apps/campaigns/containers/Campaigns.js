import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Campaigns extends Component {
  render () {
    return (
      <div className="block">
        <div className="block-content block-content-full">
            <table className="table table-striped table-borderless table-vcenter">
                <thead>
                    <tr>
                        <th colSpan="2">{'Introduction'}</th>
                        <th className="text-center hidden-xs hidden-sm" style={{width: '100px'}}>{'Topics'}</th>
                        <th className="text-center hidden-xs hidden-sm" style={{width: '100px'}}>{'Posts'}</th>
                        <th className="hidden-xs hidden-sm" style={{width: '200px'}}>{'Last Post'}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center" style={{width: '75px'}}>
                            <i className="si si-check fa-2x"></i>
                        </td>
                        <td>
                            <h4 className="h5 font-w600 push-5">
                                <a href="base_pages_forum_topics.html">Welcome</a>
                            </h4>
                            <div className="font-s13 text-muted">Feel free to introduce yourself</div>
                        </td>
                        <td className="text-center hidden-xs hidden-sm">
                            <a className="font-w600" href="javascript:void(0)">195</a>
                        </td>
                        <td className="text-center hidden-xs hidden-sm">
                            <a className="font-w600" href="javascript:void(0)">756</a>
                        </td>
                        <td className="hidden-xs hidden-sm">
                            <span className="font-s13">
                              {'by '}
                              <a href="base_pages_profile.html">Eric Lawson</a>
                              <span>July 23, 2015</span>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table className="table table-striped table-borderless table-vcenter">
                <thead>
                    <tr>
                        <th colSpan="2">Web Application</th>
                        <th className="text-center hidden-xs hidden-sm" style={{width: '100px'}}>Topics</th>
                        <th className="text-center hidden-xs hidden-sm" style={{width: '100px'}}>Posts</th>
                        <th className="hidden-xs hidden-sm" style={{width: '200px'}}>Last Post</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center" style={{width: '75px'}}>
                            <i className="si si-check fa-2x"></i>
                        </td>
                        <td>
                            <h4 className="h5 font-w600 push-5">
                                <a href="base_pages_forum_topics.html">Getting Started</a>
                            </h4>
                            <div className="font-s13 text-muted">New user? Don't worry, you will find everything you need</div>
                        </td>
                        <td className="text-center hidden-xs hidden-sm">
                            <a className="font-w600" href="javascript:void(0)">210</a>
                        </td>
                        <td className="text-center hidden-xs hidden-sm">
                            <a className="font-w600" href="javascript:void(0)">980</a>
                        </td>
                        <td className="hidden-xs hidden-sm">
                            <span className="font-s13">by <a href="base_pages_profile.html">Joshua Munoz</a><span>July 17, 2015</span></span>
                        </td>
                    </tr>
                  </tbody>
            </table>
            <table className="table table-striped table-borderless table-vcenter">
                <thead>
                    <tr>
                        <th colSpan="2">Support</th>
                        <th className="text-center hidden-xs hidden-sm" style={{width: '100px'}}>Topics</th>
                        <th className="text-center hidden-xs hidden-sm" style={{width: '100px'}}>Posts</th>
                        <th className="hidden-xs hidden-sm" style={{width: '200px'}}>Last Post</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center" style={{width: '75px'}}>
                            <i className="si si-info fa-2x"></i>
                        </td>
                        <td>
                            <h4 className="h5 font-w600 push-5">
                                <a href="base_pages_forum_topics.html">How To Guides</a>
                            </h4>
                            <div className="font-s13 text-muted">The best hand crafted guides just for you</div>
                        </td>
                        <td className="text-center hidden-xs hidden-sm">
                            <a className="font-w600" href="javascript:void(0)">980</a>
                        </td>
                        <td className="text-center hidden-xs hidden-sm">
                            <a className="font-w600" href="javascript:void(0)">2156</a>
                        </td>
                        <td className="hidden-xs hidden-sm">
                            <span className="font-s13">by <a href="base_pages_profile.html">Emma Cooper</a><span>July 10, 2015</span></span>
                        </td>
                    </tr>
                </tbody>
            </table>
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

