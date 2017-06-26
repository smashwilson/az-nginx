import React, {Component} from 'react'

export default class Dashboard extends Component {
  render () {
    return (
      <div className='panel panel-info'>
        <div className='panel-heading'>
          <h3 className='panel-title'>Why hello there</h3>
        </div>
        <div className='panel-body'>
          {"Pretend there's something awesome written here. Also that the" +
          ' navigation links on the left over there work.'}
        </div>
      </div>
    )
  }
}
