import React, {Component} from 'react'
import {QueryRenderer, graphql} from 'react-relay'
import PropTypes from 'prop-types'

import {getEnvironment} from './Transport'

export default class Profile extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  constructor (props) {
    super(props)

    this.environment = getEnvironment()
  }

  render () {
    const query = graphql`
      query ProfileQuery($name: String!, $titleCriteria: Criteria!) {
        users {
          current: withName(name: $name) {
            avatar {
              image192
            }

            topReactionsReceived(limit: 10) {
              count
              emoji {
                name
                url
              }
            }

            topReactionsGiven(limit: 10) {
              count
              emoji {
                name
                url
              }
            }
          }
        }

        titles: documents(set: "title") {
          all(first: 100, criteria: $titleCriteria) {
            edges {
              node {
                text
              }
            }
          }
        }

        quotes: documents(set: "quote") {
          rank(speaker: $name)
        }
      }
    `

    const username = this.props.match.params.name
    const variables = {
      name: username,
      titleCriteria: {subject: username}
    }

    return (
      <QueryRenderer
        environment={this.environment}
        query={query}
        variables={variables}
        render={this.renderResult}
      />
    )
  }

  renderResult = ({error, props}) => {
    if (error) {
      return <div>{error.message}</div>
    }

    if (!props) {
      return (
        <div className='pushbot-loading'>
          <i className='fa fa-circle-o-notch fa-spin' aria-hidden='true' />
          sluuuuurp
        </div>
      )
    }

    return (
      <div className='pushbot-profile row'>
        <div className='col-md-4'>
          <img src={props.users.current.avatar.image192} />
        </div>
        <div className='col-md-8'>
          <code>{JSON.stringify(props, null, 2)}</code>
        </div>
      </div>
    )
  }
}
