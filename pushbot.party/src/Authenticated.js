import React, {Component} from 'react'

import SideNav from './SideNav.js'

export default class Authenticated extends Component {
  render () {
    return (
      <div className='row'>
        <div className='col-md-2'>
          <SideNav />
        </div>
        <div className='col-md-8'>
          <div className='panel panel-info'>
            <div className='panel-heading'>
              <h3 className='panel-title'>Why hello there</h3>
            </div>
            <div className='panel-body'>
              {"Pretend there's something awesome written here. Also that the" +
              ' navigation links on the left over there work.'}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
