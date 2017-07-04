import React, {Component} from 'react'
import {Link, Route} from 'react-router-dom'
import PropTypes from 'prop-types'

class Pill extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    exact: PropTypes.bool,
    children: PropTypes.element.isRequired
  }

  render () {
    return (
      <Route path={this.props.to} exact={this.props.exact} children={props => {
        const klass = props.match ? 'active' : ''

        return (
          <li role='presentation' className={klass}>
            <Link to={this.props.to}>{this.props.children}</Link>
          </li>
        )
      }} />
    )
  }
}

export default class SideNav extends Component {
  render () {
    return (
      <ul className='nav nav-pills nav-stacked'>
        <Pill to='/' exact>dashboard</Pill>
        <Pill to='/people'>dramatis personae</Pill>
        <hr />
        <Pill to='/quotes'>quotes</Pill>
        <Pill to='/limericks'>limericks</Pill>
      </ul>
    )
  }
}
