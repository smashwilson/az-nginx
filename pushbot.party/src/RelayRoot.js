/* global API_BASE_URL */

import React, { Component } from 'react'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { QueryRenderer, graphql } from 'react-relay'

import Banner from './Banner'
import Login from './Login'

const API_URL = `${API_BASE_URL}/graphql`
const AUTH_URL = `${API_BASE_URL}/auth/slack`

async function fetchQuery (operation, variables, cacheConfig, uploadables) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  })

  if (response.ok) {
    return response.json()
  } else {
    const err = new Error(`API server responded with ${response.status}`)
    err.status = response.status
    err.text = await response.text()
    throw err
  }
}

const source = new RecordSource()
const store = new Store(source)
const network = Network.create(fetchQuery)

const environment = new Environment({
  network,
  store
})

export default class RelayRoot extends Component {
  constructor (props, context) {
    super(props, context)
    this.renderResult = this.renderResult.bind(this)
  }

  render () {
    const query = graphql`
      query RelayRootQuery {
        me {
          name
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
    let body = null

    if (error) {
      if (error.status === 401) {
        body = this.renderUnauthenticated()
      } else {
        body = this.renderError(error)
      }
    } else if (props) {
      body = this.renderBody(props)
    } else {
      body = this.renderLoading()
    }

    return (
      <div>
        <div className='row'>
          <Banner />
        </div>
        {body}
      </div>
    )
  }

  renderBody (props) {
    return (
      <div className='row'>
        <div className='col-md-2'>
          Nav here
        </div>
        <div className='col-md-8'>
          <pre>{JSON.stringify(props)}</pre>
        </div>
      </div>
    )
  }

  renderUnauthenticated () {
    return (
      <Login authUrl={`${AUTH_URL}?backTo=%2F`} />
    )
  }

  renderError (error) {
    return (
      <div>{error.message}</div>
    )
  }

  renderLoading () {
    return (
      <div>Loading</div>
    )
  }
}
