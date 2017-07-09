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

    if (!props) {
      return null
    }

    const quotes = props.documents.all.edges.map(document => {
      return <Quote key={document.id} text={document.node.text} />
    })

    return (
      <div className='pushbot-results'>
        {quotes}
      </div>
    )
  }
}

class RandomQuote extends Component {
  constructor (props, context) {
    super(props, context)

    this.renderResult = this.renderResult.bind(this)

    this.environment = getEnvironment()
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
        environment={this.environment}
        query={query}
        render={this.renderResult}
      />
    )
  }

  renderResult ({error, props}) {
    if (error) {
      return <div>{error.message}</div>
    }

    if (!props) {
      return null
    }

    return <Quote text={props.documents.random.text} />
  }
}

export default class Quotes extends Component {
  constructor (props, context) {
    super(props, context)

    this.didChangeQuery = this.didChangeQuery.bind(this)
    this.state = {
      query: ''
    }
  }

  render () {
    return (
      <div>
        <form className='form-inline'>
          <label htmlFor='query'>Search</label>
          <input
            type='text'
            className='form-control'
            id='query'
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

  didChangeQuery (event) {
    this.setState({query: event.target.value})
  }
}
