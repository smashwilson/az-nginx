import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Login.css'

export default class Login extends Component {
  static propTypes = {
    authUrl: PropTypes.string.isRequired
  }

  componentDidMount () {
    document.children[0].classList.add('pushbot-login-bg')
  }

  render () {
    return (
      <div className='jumbotron pushbot-login'>
        <h1>Are there stairs in your house?</h1>
        <p>
          <a href={this.props.authUrl} className='pushbot-signin-slack'>
            <img
              alt='Sign in with Slack'
              height='40'
              width='172'
              src='https://platform.slack-edge.com/img/sign_in_with_slack.png'
              srcSet='https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x'
            />
          </a>
          so that I may protect you from the
          <a href='https://www.youtube.com/watch?v=7E0ot9iJm_k'>
            terrible secret of space
          </a>
        </p>
        <p className='text-muted'>
          <em><small>
            (Make sure that you choose <strong>#~s</strong> as your Slack team)
          </small></em>
        </p>
      </div>
    )
  }

  componentWillUnmount () {
    document.children[0].classList.remove('pushbot-login-bg')
  }
}
