import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Banner extends Component {
  static propTypes = {
    username: PropTypes.string,
    title: PropTypes.string
  }

  render () {
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
            <ul className='nav navbar-nav navbar-right'>
              <button className='btn btn-default navbar-btn'>
                Sign in
              </button>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
