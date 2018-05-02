import React, {Component} from 'react'
import {QueryRenderer, graphql} from 'react-relay'
import PropTypes from 'prop-types'

import {getEnvironment} from './Transport'
import Chart from './Chart'
import EmojiConverter from 'emoji-js'

import './Profile.css'

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
    this.emoji = new EmojiConverter()

    this.emoji.img_sets.apple.sheet = '/sheet_apple_64.png'
    this.emoji.use_sheet = true
    this.emoji.include_title = true
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
        <div className='col-md-6'>
          <img
            className='pushbot-profile-avatar img-responsive img-rounded'
            src={props.users.current.avatar.image192}
          />
          {this.renderReactionsReceivedChart(props)}
          {this.renderReactionsGivenChart(props)}
        </div>
        <div className='col-md-6'>
          <h1 className='pushbot-profile-username'>@{this.props.match.params.name}</h1>
          {this.renderTitles(props)}
          {this.renderQuoteRank(props)}
        </div>
      </div>
    )
  }

  renderReactionsGivenChart (props) {
    return this.renderReactionChart(props.users.current.topReactionsGiven, 'Emoji reactions given')
  }

  renderReactionsReceivedChart (props) {
    return this.renderReactionChart(props.users.current.topReactionsReceived, 'Emoji reactions received')
  }

  renderReactionChart (results, name) {
    const data = {
      labels: results.map(each => {
        if (each.emoji.url) {
          return `<img class="emoji" src="${each.emoji.url}" title="${each.emoji.name}">`
        }

        return this.emoji.replace_colons(`:${each.emoji.name}:`)
      }),
      series: [
        results.map(each => each.count)
      ]
    }

    const options = {
      low: 0,
      axisY: {
        onlyInteger: true
      }
    }

    return (
      <p className='pushbot-profile-reaction-chart'>
        <h4>{name}</h4>
        <Chart data={data} options={options} />
      </p>
    )
  }

  renderTitles (props) {
    const edges = props.titles.all.edges
    if (edges.length === 0) {
      return (
        <p className='pushbot-profile-titles-empty'>
          No titles yet. Set one with <code>!settitle {this.props.match.params.name}: ...</code>.
        </p>
      )
    }

    return (
      <p className='pushbot-profile-titles'>
        {props.titles.all.edges.map(t => this.titleFrom(t.node.text))}
      </p>
    )
  }

  renderQuoteRank (props) {
    const rank = props.quotes.rank
    return (
      <p className='pushbot-profile-quoterank'>
        Rank #{rank} in the quotefile.
      </p>
    )
  }

  titleFrom (title) {
    if (/^https?:/.test(title)) {
      return <img className='pushbot-profile-title img-responsive' src={title} />
    }

    return <span className='pushbot-profile-title'>{title}</span>
  }
}
