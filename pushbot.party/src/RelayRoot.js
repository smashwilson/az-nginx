import React, { Component } from 'react'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { QueryRenderer, graphql } from 'react-relay'

async function fetchQuery(operation, variables, cacheConfig, uploadables) {
  const response = await fetch('https://api.pushbot.party/graphql', {
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

  return response.json()
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
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query RelayRootQuery {
            me {
              name
            }
          }
        `}
        render={this.inner.bind(this)} />
    )
  }

  inner(error, props) {
    if (error) {
      return <div>{error.message}</div>
    } else if (props) {
      return <div><pre>{JSON.stringify(props)}</pre></div>
    } else {
      return <div>Loading</div>
    }
  }
}
