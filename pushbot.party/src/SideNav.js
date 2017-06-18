import React, {Component} from 'react'

export default class SideNav extends Component {
  render () {
    return (
      <ul className='nav nav-pills nav-stacked'>
        <li role='presentation' className='active'>
          <a href='#'>dashboard</a>
        </li>
        <li role='presentation'>
          <a href='#'>dramatis personae</a>
        </li>
        <li role='presentation'>
          <a href='#'>buffer</a>
        </li>
        <li role='presentation'>
          <a href='#'>help</a>
        </li>
      </ul>
    )
  }
}
