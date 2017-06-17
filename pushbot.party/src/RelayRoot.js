/* global API_BASE_URL */

import React, { Component } from 'react'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { QueryRenderer, graphql } from 'react-relay'

import Login from './Login'

const API_URL = `${API_BASE_URL}/graphql`
const AUTH_URL = `${API_BASE_URL}/auth/slack`

async function fetchQuery(operation, variables, cacheConfig, uploadables) {
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
  render() {
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
        render={this.renderResult.bind(this)} />
    )
  }

  renderResult({error, props}) {
    if (error) {
      if (error.status === 401) {
        return <Login authUrl={`${AUTH_URL}?backTo=%2F`} />
      } else {
        return <div>{error.message}</div>
      }
    } else if (props) {
      return <div><pre>{JSON.stringify(props)}</pre></div>
    } else {
      return <div>Loading</div>
    }
  }
}
