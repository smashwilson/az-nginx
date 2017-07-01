import React, {Component} from 'react'
import {QueryRenderer, graphql} from 'react-relay'
import PropTypes from 'prop-types'

import {environment} from './Transport'

import './People.css'

class Person extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      presence: PropTypes.string.isRequired,
      avatar: PropTypes.shape({
        image48: PropTypes.string.isRequired
      }).isRequired,
      status: PropTypes.shape({
        message: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    title: PropTypes.string.isRequired
  }

  render () {
    const {name, presence, avatar, status} = this.props.user
    const avatarURL = avatar.image48
    const presenceIcon = presence === 'ACTIVE'
      ? 'pushbot-status-active fa-dot-circle-o'
      : 'pushbot-status-inactive fa-circle-o'
    const {message} = status

    return (
      <div className='pushbot-person row'>
        <div className='col-xs-1'>
          <img src={avatarURL} className='img-rounded' />
        </div>
        <div className='col-xs-11'>
          <p>
            <i className={`fa pushbot-status ${presenceIcon}`} aria-hidden='true' />
            <span className='pushbot-person-name'>{name}</span>
            <span className='pushbot-person-title'>{this.props.title}</span>
          </p>
          <p className='pushbot-person-status-message'>{message}</p>
        </div>
      </div>
    )
  }
}

export default class People extends Component {
  constructor (props, context) {
    super(props, context)
    this.renderResult = this.renderResult.bind(this)
  }

  render () {
    const query = graphql`
      query PeopleQuery {
        users {
          all {
            name
            presence

            avatar {
              image48
            }

            status {
              message
              emoji
            }
          }
        }

        titles: documents(set: "title") {
          all(criteria: {}) {
            edges {
              node {
                text
                subject
              }
            }
          }
        }
      }
    `

    return (
      <QueryRenderer
        environment={environment}
        query={query}
        render={this.renderResult} />
    )
  }

  renderResult ({error, props}) {
    if (error) {
      return <div>{error.message}</div>
    }

    return (
      <div>
        <h3>Dramatis Personae</h3>
        <blockquote className='blockquote-reverse'>
          Maybe the <em>real</em> lab was the friends we made along the way.
        </blockquote>
        <ul className='list-group'>
          {this.collateUsers(props).map(({user, title}) => {
            return (
              <li key={user.name} className='list-group-item'>
                <Person user={user} title={title} />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  collateUsers (props) {
    if (!props) {
      return []
    }

    const titlesByUsername = {}
    for (const title of props.titles.all.edges) {
      titlesByUsername[title.node.subject] = title.node.text
    }

    const userData = props.users.all.map(user => {
      return {user, title: titlesByUsername[user.name] || ''}
    })

    userData.sort((a, b) => a.user.name.localeCompare(b.user.name))

    return userData
  }
}
