/* global API_BASE_URL */

import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './Banner.css'

const LOGOUT_URL = `${API_BASE_URL}/logout?backTo=true`

export default class Banner extends Component {
  static propTypes = {
    username: PropTypes.string,
    title: PropTypes.string,
    avatar: PropTypes.string
  }

  render () {
    let accountControl = null

    if (this.props.username) {
      let accountElements = []
      if (this.props.title) {
        accountElements.push(
          <span key='0' className='pushbot-navbar-title'>{this.props.title}</span>
        )
        accountElements.push(
          <i key='1' className='fa fa-circle pushbot-navbar-separator' aria-hidden='true' />
        )
      }
      accountElements.push(
        <span key='2' className='pushbot-navbar-username'>
          @{this.props.username}
        </span>
      )

      accountControl = (
        <ul className='nav navbar-nav navbar-right'>
          <li>
            <p className='navbar-text'>
              {accountElements}
            </p>
          </li>
          <li>
            <img className='pushbot-navbar-avatar' src={this.props.avatar} />
          </li>
          <li>
            <a href={LOGOUT_URL} className='btn btn-link navbar-btn pushbot-navbar-logout'>
              <i className='fa fa-sign-out' aria-hidden='true' />
              Log out
            </a>
          </li>
        </ul>
      )
    }

    return (
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#bs-example-navbar-collapse-1' aria-expanded='false'>
              <span className='sr-only'>Toggle navigation</span>
            </button>
            <p className='navbar-brand'>pushbot party</p>
          </div>

          <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
            {accountControl}
          </div>
        </div>
      </nav>
    )
  }
}
