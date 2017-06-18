import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './Banner.css'

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
          <span className='pushbot-navbar-title'>{this.props.title}</span>
        )
        accountElements.push(
          <i className='fa fa-circle pushbot-navbar-separator' aria-hidden='true' />
        )
      }
      accountElements.push(
        <span className='pushbot-navbar-username'>
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
            <button type='button' className='btn btn-link navbar-btn pushbot-navbar-logout'>
              <i className='fa fa-sign-out' aria-hidden='true' />
              Log out
            </button>
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
