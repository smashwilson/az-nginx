import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import SideNav from './SideNav.js'
import Dashboard from './Dashboard.js'
import People from './People.js'
import Quotes from './Quotes.js'

export default class Authenticated extends Component {
  render () {
    return (
      <Router>
        <div className='row'>
          <div className='col-md-2'>
            <SideNav />
          </div>
          <div className='col-md-8'>
            <Route path='/' component={Dashboard} exact />
            <Route path='/people' component={People} />
            <Route path='/quotes' component={Quotes} />
          </div>
        </div>
      </Router>
    )
  }
}
