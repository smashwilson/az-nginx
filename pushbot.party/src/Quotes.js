import React, {Component} from 'react'
import {QueryRenderer, graphql} from 'react-relay'
import PropTypes from 'prop-types'

import {getEnvironment} from './Transport'

import './Quotes.css'

class Quote extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  }

  render () {
    return (
      <blockquote className='pushbot-quote'>
        <p>{this.props.text}</p>
      </blockquote>
    )
  }
}

class QuotePage extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.renderResult = this.renderResult.bind(this)

    this.environment = getEnvironment()

    this.lastResults = null
  }

  render () {
    const query = graphql`
      query QuotesPageQuery($c: Criteria!) {
        documents(set: "quote") {
          all(criteria: $c, first: 20) {
            edges {
              node {
                id
                text
              }
            }

            pageInfo {
              count
              hasNextPage
            }
          }
        }
      }
    `

    const variables = {
      c: {query: this.props.query},
      perPage: 20,
      cursor: null
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

  renderResult ({error, props}) {
    if (error) {
      return <div>{error.message}</div>
    }

    if (!props && !this.lastResults) {
      return (
        <div className='pushbot-loading'>
          <i className='fa fa-circle-o-notch fa-spin' aria-hidden='true' />
          performing query
        </div>
      )
    } else if (!props && this.lastResults) {
      return this.renderDocuments(this.lastTotal, this.lastResults)
    } else if (props) {
      this.lastTotal = props.documents.all.pageInfo.count
      this.lastResults = props.documents.all.edges

      return this.renderDocuments(this.lastTotal, this.lastResults)
    }
  }

  renderDocuments (total, documents) {
    const quotes = documents.map(document => {
      return <Quote key={document.id} text={document.node.text} />
    })

    const more = documents.length < total ? 'the first of' : ''
    const plural = total === 1 ? `matching quote` : `matching quotes`

    return (
      <div className='pushbot-results'>
        <div className='well well-sm'>
          <p>
            Showing {more} <strong>{total}</strong> {plural}.
          </p>
        </div>
        {quotes}
      </div>
    )
  }
}

class RandomQuote extends Component {
  constructor (props, context) {
    super(props, context)

    this.renderResult = this.renderResult.bind(this)
    this.another = this.another.bind(this)

    this.lastQuote = null
    this.state = {
      environment: getEnvironment()
    }
  }

  render () {
    const query = graphql`
      query QuotesRandomQuery {
        documents(set: "quote") {
          random(criteria: {}) {
            found
            text
          }
        }
      }
    `

    return (
      <QueryRenderer
        environment={this.state.environment}
        query={query}
        render={this.renderResult}
      />
    )
  }

  renderResult ({error, props}) {
    if (error) {
      return <div>{error.message}</div>
    }

    const quoteText = props
      ? props.documents.random.text
      : this.lastQuote

    if (!quoteText) {
      return null
    }

    this.lastQuote = quoteText

    return (
      <div className='pushbot-random-quote'>
        <div className='well well-sm'>
          <p>
            Type a search term above to find specific quotes. In the meantime,
            enjoy this random quote.
          </p>
          <button type='button' className='btn btn-sm' onClick={this.another}>
            <i className='fa fa-refresh' aria-hidden='true' />
            Another
          </button>
        </div>
        <Quote text={quoteText} />
      </div>
    )
  }

  another () {
    this.setState({
      environment: getEnvironment()
    })
  }
}

const CONTAINING = {
  when (cases) {
    return cases.containing || cases.default || null
  },

  label: 'containing'
}

const BY = {
  when (cases) {
    return cases.by || cases.default || null
  },

  label: 'by'
}

const ABOUT = {
  when (cases) {
    return cases.about || cases.default || null
  },

  label: 'about'
}

const modes = [CONTAINING, BY, ABOUT]

export default class Quotes extends Component {
  constructor (props, context) {
    super(props, context)

    this.didChangeMode = this.didChangeMode.bind(this)
    this.didChangeQuery = this.didChangeQuery.bind(this)
    this.didChangePeople = this.didChangePeople.bind(this)

    this.state = {
      people: '',
      query: '',
      mode: CONTAINING
    }
  }

  render () {
    const showPeople = this.state.mode.when({
      containing: false,
      by: true,
      about: true
    })

    return (
      <div>
        <form className={`pushbot-quote-form form-inline pushbot-mode-${this.state.mode.label}`}>
          <select className='pushbot-quote-mode form-control' value={this.state.mode.label} onChange={this.didChangeMode}>
            {modes.map((mode, index) => {
              return <option key={index} value={mode.label}>{mode.label}</option>
            })}
          </select>
          {showPeople && (
            <input
              type='text'
              className='form-control'
              id='pushbot-quote-people'
              placeholder='fenris, iguanaditty'
              value={this.state.people}
              onChange={this.didChangePeople}
            />
          )}
          <input
            type='text'
            className='form-control'
            id='pushbot-quote-query'
            placeholder='"query"'
            value={this.state.query}
            onChange={this.didChangeQuery}
          />
        </form>
        {this.renderResult()}
      </div>
    )
  }

  renderResult () {
    if (this.state.query.length === 0) {
      return <RandomQuote />
    }

    return <QuotePage query={this.state.query} />
  }

  didChangeMode (event) {
    const mode = modes.find(mode => mode.label === event.target.value)
    this.setState({mode})
  }

  didChangeQuery (event) {
    this.setState({query: event.target.value})
  }

  didChangePeople (event) {
    this.setState({people: event.target.value})
  }
}
