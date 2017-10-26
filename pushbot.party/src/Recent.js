import React, {Component} from 'react'
import {QueryRenderer, graphql} from 'react-relay'
import PropTypes from 'prop-types'
import moment from 'moment'

import {getEnvironment} from './Transport'
import Role from './Role'

import './Recent.css'

const UserPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
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

class Selection {
  constructor () {
    this.ids = new Set()
    this.isSelecting = false
    this.subs = []
  }

  onDidChange (cb) {
    this.subs.push(cb)
    return {
      dispose: () => {
        const index = this.subs.indexOf(cb)
        this.subs.splice(index, 1)
      }
    }
  }

  didChange () {
    for (const sub of this.subs) {
      sub()
    }
  }

  isSelected (line) {
    return this.ids.has(line.id)
  }

  select (line) {
    const wasSelected = this.ids.has(line.id)
    this.ids.add(line.id)
    if (!wasSelected) this.didChange()
    return !wasSelected
  }

  startSelecting () {
    this.isSelecting = true
  }

  stopSelecting () {
    this.isSelecting = false
  }

  toggle (line) {
    if (!this.ids.delete(line.id)) {
      this.ids.add(line.id)
    }
    this.didChange()
  }

  clear () {
    this.ids.clear()
    this.didChange()
  }

  getLineIDs () {
    return Array.from(this.ids)
  }

  isEmpty () {
    return this.ids.size === 0
  }

  describe () {
    if (this.ids.size === 0) {
      return 'nothing selected'
    } else if (this.ids.size === 1) {
      return '1 line selected'
    } else {
      return `${this.ids.size} lines selected`
    }
  }
}

class Line extends Component {
  static propTypes = {
    previous: LinePropType,
    line: LinePropType.isRequired,
    selection: PropTypes.instanceOf(Selection).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.didMouseDown = this.didMouseDown.bind(this)
    this.didMouseMove = this.didMouseMove.bind(this)
  }

  render () {
    const {line, previous} = this.props
    const ts = moment(parseInt(line.timestamp))
    const sameSpeaker = previous && (previous.speaker.id === line.speaker.id)

    const lineClasses = ['pushbot-line']
    if (this.props.selection.isSelected(line)) lineClasses.push('pushbot-line-selected')

    return (
      <p className={lineClasses.join(' ')} onMouseDown={this.didMouseDown} onMouseMove={this.didMouseMove}>
        <span className='pushbot-line-avatar'>
          {sameSpeaker || <img src={line.speaker.avatar.image32} />}
        </span>
        <span className='pushbot-line-name'>
          {sameSpeaker || line.speaker.name}
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

  didMouseDown (event) {
    if (event.button !== 0) return

    event.preventDefault()
    this.props.selection.toggle(this.props.line)
    this.props.selection.startSelecting()
    this.forceUpdate()
  }

  didMouseMove (event) {
    if (!this.props.selection.isSelecting) return

    event.preventDefault()
    if (this.props.selection.select(this.props.line)) {
      this.forceUpdate()
    }
  }
}

class History extends Component {
  static propTypes = {
    lines: PropTypes.arrayOf(LinePropType),
    selection: PropTypes.instanceOf(Selection).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.didMouseUp = this.didMouseUp.bind(this)
  }

  componentDidMount () {
    window.addEventListener('mouseup', this.didMouseUp)

    this.bottom && this.bottom.scrollIntoView()
  }

  componentDidUpdate () {
    this.bottom && this.bottom.scrollIntoView()
  }

  componentWillUnmount () {
    window.removeEventListener('mouseup', this.didMouseUp)
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
      <div className='pushbot-history pushbot-loading'>
        <i className='fa fa-circle-o-notch fa-spin' aria-hidden='true' />
        loading
      </div>
    )
  }

  renderLines () {
    return (
      <div className='pushbot-history pushbot-history-loaded' onMouseOut={this.didMouseOut}>
        {this.props.lines.map((line, i) => {
          return (
            <Line
              key={line.id}
              line={line}
              previous={this.props.lines[i - 1]}
              selection={this.props.selection}
            />
          )
        })}
        <div ref={element => { this.bottom = element }} />
      </div>
    )
  }

  didMouseUp () {
    this.props.selection.stopSelecting()
  }
}

class ActionBar extends Component {
  static propTypes = {
    selection: PropTypes.instanceOf(Selection).isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.didClear = this.didClear.bind(this)
  }

  componentDidMount () {
    this.sub = this.props.selection.onDidChange(() => this.forceUpdate())
  }

  componentWillUnmount () {
    this.sub.dispose()
  }

  render () {
    const textClassNames = ['text-muted']
    let clearBtn = null
    if (!this.props.selection.isEmpty()) {
      clearBtn = <button className='btn btn-link' onClick={this.didClear}>clear</button>
    } else {
      textClassNames.push('pushbot-empty')
    }

    return (
      <div className='pushbot-recent-actions'>
        <p className={textClassNames.join(' ')}>
          {this.props.selection.describe()}
          {clearBtn}
        </p>
        <div className='btn-group pushbot-recent-actions'>
          <Role name='quote pontiff'>
            <button className='btn btn-primary'>Quote</button>
          </Role>
          <Role name='poet laureate'>
            <button className='btn btn-primary'>Limerick</button>
          </Role>
        </div>
      </div>
    )
  }

  didClear () {
    this.props.selection.clear()
  }
}

export default class Recent extends Component {
  constructor (props, context) {
    super(props, context)

    this.knownChannels = null
    this.history = null

    this.state = {
      environment: getEnvironment(),
      currentChannel: null,
      selection: new Selection()
    }

    this.renderChannelResult = this.renderChannelResult.bind(this)
    this.renderHistoryResult = this.renderHistoryResult.bind(this)
    this.refresh = this.refresh.bind(this)
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
          <label htmlFor='pushbot-recent-channel'>Channel</label>
          <select
            className='pushbot-recent-channel form-control'
            id='pushbot-recent-channel'
            value={displayChannel}
            disabled={!channelNames}
            onChange={this.didChangeChannel}>
            {displayChannelNames.map(name => {
              return <option key={name} value={name}>{name}</option>
            })}
          </select>
          <button className='btn btn-default pushbot-recent-refresh' onClick={this.refresh} >
            <i className='fa fa-refresh' aria-hidden /> Refresh
          </button>
        </form>
        <History lines={history} selection={this.state.selection} />
        <ActionBar selection={this.state.selection} />
      </div>
    )
  }

  didChangeChannel (event) {
    this.history = null
    this.selection.clear()
    this.setState({currentChannel: event.target.value})
  }

  refresh (event) {
    event.preventDefault()
    this.setState({environment: getEnvironment()})
  }
}
