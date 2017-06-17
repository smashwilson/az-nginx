import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Banner extends Component {
  static propTypes = {
    username: PropTypes.string,
    title: PropTypes.string,
    avatar: PropTypes.object
  }

  render () {
    let accountControl = null

    if (this.props.username) {
      accountControl = (
        <ul className='nav navbar-nav navbar-right'>
          <li>
            <p className='navbar-text'>
              {this.props.title &&
                <span className='navbar-title'>
                  {this.props.title}
                </span>}
              {this.props.title &&
                <i className='fa fa-circle' aria-hidden='true' />}
              <span className='navbar-username'>
                @{this.props.username}
              </span>
            </p>
          </li>
          <li>
            <img src={this.props.avatar} />
          </li>
          <li>
            <button type='button' className='btn btn-default navbar-btn'>
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
            <a className='navbar-brand' href='#'>pushbot party</a>
          </div>

          <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
            {accountControl}
          </div>
        </div>
      </nav>
    )
  }
}
