import React from 'react'
import PropTypes from 'prop-types'
import {QueryRenderer, graphql} from 'react-relay'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import {getEnvironment} from './Transport'

class FeedForm extends React.Component {
  static propTypes = {
    ready: PropTypes.bool.isRequired,
    feedURL: PropTypes.string.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      copied: false
    }
  }

  render () {
    const btnClass = this.state.copied ? 'btn btn-success' : 'btn btn-default'
    const btnMessage = this.state.copied ? 'Copied' : 'Copy'

    return (
      <p className='form-inline'>
        <input type='text' className='form-control' value={this.props.feedURL} readOnly />
        <CopyToClipboard text={this.props.feedURL} onCopy={() => this.setState({copied: true})}>
          <button className={btnClass} disabled={!this.props.ready}>{btnMessage}</button>
        </CopyToClipboard>
      </p>
    )
  }
}

export default class Events extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.renderResult = this.renderResult.bind(this)
    this.environment = getEnvironment()
  }

  render () {
    const query = graphql`
      query EventsQuery {
        calendarURL
      }
    `

    return (
      <QueryRenderer
        environment={this.environment}
        query={query}
        render={this.renderResult}
      />
    )
  }

  renderResult ({error, props}) {
    return (
      <div>
        <h3>Goings On and Happenings</h3>
        {this.renderResultBody({error, props})}
      </div>
    )
  }

  renderResultBody ({error, props}) {
    if (error) {
      return (
        <div>{error.message}</div>
      )
    }

    const ready = Boolean(props)
    const feedURL = ready ? props.calendarURL : '...'

    return (
      <div>
        <p>
          Keep up with #~s events planned in the <code>#events</code> channel with an iCal feed.
        </p>
        <FeedForm ready={ready} feedURL={feedURL} />
        <p>
          Subscribe to this URL with any compatible calendar software,
          including <a href='https://calendar.google.com/calendar/r/settings/addbyurl' target='_blank'>Google calendar</a>.
        </p>
      </div>
    )
  }
}
