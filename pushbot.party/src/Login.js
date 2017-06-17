import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Login extends Component {
  static propTypes = {
    authUrl: PropTypes.string.isRequired
  }

  render () {
    return (
      <a href={this.props.authUrl}>
        <img
          alt='Sign in with Slack'
          height='40'
          width='172'
          src='https://platform.slack-edge.com/img/sign_in_with_slack.png'
          srcSet='https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x'
        />
      </a>
    )
  }
}
