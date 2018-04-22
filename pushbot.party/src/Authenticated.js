import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import SideNav from './SideNav.js'
import Dashboard from './Dashboard.js'
import People from './People.js'
import Profile from './Profile.js'
import Quotes from './Quotes.js'
import Events from './Events.js'
import Recent from './Recent.js'

import {UserPropType} from './Role'

export default class Authenticated extends Component {
  static propTypes = {
    user: UserPropType
  }

  static childContextTypes = {
    user: UserPropType
  }

  getChildContext () {
    return {user: this.props.user}
  }

  render () {
    return (
      <Router>
        <div className='row'>
          <div className='col-md-2'>
            <SideNav />
          </div>
          <div className='col-md-8'>
            <Route path='/' component={Dashboard} exact />
            <Route path='/people' component={People} exact />
            <Route path='/people/:name' component={Profile} />
            <Route path='/quotes' component={Quotes} />
            <Route path='/events' component={Events} />
            <Route path='/recent' component={Recent} />
          </div>
        </div>
      </Router>
    )
  }
}
