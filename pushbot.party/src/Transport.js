/* global API_BASE_URL */

import {Environment, Network, RecordSource, Store} from 'relay-runtime'

const API_URL = `${API_BASE_URL}/graphql`
export const AUTH_URL = `${API_BASE_URL}/auth/slack`

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
const network = Network.create(fetchQuery)

export function getEnvironment () {
  const store = new Store(source)

  return new Environment({
    network,
    store
  })
}
