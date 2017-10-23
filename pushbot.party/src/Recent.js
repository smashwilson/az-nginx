import React, {Component} from 'react'
import {QueryRenderer, graphql} from 'react-relay'
import PropTypes from 'prop-types'
import moment from 'moment'

import {getEnvironment} from './Transport'

const UserPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  avatar: PropTypes.shape({
    image32: PropTypes.string.isRequired
  })
})

const LinePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  speaker: UserPropType.isRequired,
  timestamp: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
})

class Line extends Component {
  static propTypes = {
    line: LinePropType
  }

  render () {
    const {line} = this.props
    const ts = moment(parseInt(line.timestamp))

    return (
      <p className='pushbot-line'>
        <span className='pushbot-line-avatar'>
          <img src={line.speaker.avatar.image32} />
        </span>
        <span className='pushbot-line-name'>
          {line.speaker.name}
        </span>
        <span className='pushbot-line-timestamp'>
          {ts.format('h:mm:ss')}
        </span>
        <span className='pushbot-line-text'>
          {line.text}
        </span>
      </p>
    )
  }
}

class History extends Component {
  static propTypes = {
    lines: PropTypes.arrayOf(LinePropType)
  }

  render () {
    if (this.props.lines === null) {
      return this.renderLoading()
    } else {
      return this.renderLines()
    }
  }

  renderLoading () {
    return (
      <div className='pushbot-history pushbot-history-loading'>
        Loading
      </div>
    )
  }

  renderLines () {
    console.log(this.props.lines)
    return (
      <div className='pushbot-history pushbot-history-loaded'>
        {this.props.lines.map(line => {
          console.log(line)
          return <Line key={line.id} line={line} />
        })}
      </div>
    )
  }
}

export default class Recent extends Component {
  constructor (props, context) {
    super(props, context)

    this.knownChannels = null
    this.history = null

    this.state = {
      environment: getEnvironment(),
      currentChannel: null
    }

    this.renderChannelResult = this.renderChannelResult.bind(this)
    this.renderHistoryResult = this.renderHistoryResult.bind(this)
  }

  render () {
    if (this.knownChannels === null) {
      return this.renderChannelQuery()
    }

    return this.renderHistoryQuery()
  }

  renderError (error) {
    return (
      <div className='pushbot-recent pushbot-recent-error'>
        <h3>Recent Chatter</h3>
        <form className='pushbot-recent-form form-inline'>
          <select className='pushbot-recent-channel form-control' value='...' disabled >
            <option value='...'>...</option>
          </select>
        </form>
        <div className='pushbot-error-message'>
          {error.message}
        </div>
      </div>
    )
  }

  renderChannelQuery () {
    const query = graphql`
      query RecentChannelQuery {
        cache {
          knownChannels
        }
      }
    `

    return (
      <QueryRenderer
        environment={this.state.environment}
        query={query}
        render={this.renderChannelResult}
      />
    )
  }

  renderChannelResult ({error, props}) {
    if (error) {
      return this.renderError(error)
    }

    const channelNames = props
      ? props.cache.knownChannels
      : this.knownChannels

    return this.renderCurrent(channelNames, null)
  }

  renderHistoryQuery () {
    const query = graphql`
      query RecentHistoryQuery($channel: String!) {
        cache {
          knownChannels
          linesForChannel(channel: $channel) {
            id
            speaker {
              id
              name
              avatar {
                image32
              }
            }
            timestamp
            text
          }
        }
      }
    `

    const variables = {
      channel: this.state.currentChannel
    }

    return (
      <QueryRenderer
        environment={this.state.environment}
        query={query}
        variables={variables}
        render={this.renderHistoryResult}
      />
    )
  }

  renderHistoryResult ({error, props}) {
    if (error) {
      return this.renderError(error)
    }

    const channelNames = props
      ? props.cache.knownChannels
      : this.knownChannels

    const history = props
      ? props.cache.linesForChannel
      : this.history

    return this.renderCurrent(channelNames, history)
  }

  renderCurrent (channelNames, history) {
    if (channelNames) {
      if (!this.state.currentChannel && channelNames.length > 0) {
        setTimeout(() => this.setState({currentChannel: channelNames[0]}), 0)
      }
      this.knownChannels = channelNames
    }

    if (history) {
      this.history = history
    }

    const displayChannelNames = channelNames || ['...']
    const displayChannel = this.state.currentChannel || '...'

    return (
      <div className='pushbot-recent'>
        <h3>Recent Chatter</h3>
        <form className='pushbot-recent-form form-inline'>
          <select
            className='pushbot-recent-channel form-control'
            value={displayChannel}
            disabled={!channelNames}
            onChange={this.didChangeChannel}>
            {displayChannelNames.map(name => {
              return <option key={name} value={name}>{name}</option>
            })}
          </select>
        </form>
        <History lines={history} />
      </div>
    )
  }

  didChangeChannel (event) {
    this.setState({currentChannel: event.target.value})
  }
}