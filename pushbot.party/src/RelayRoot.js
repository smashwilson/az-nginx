/* global API_BASE_URL */

import React, { Component } from 'react'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { QueryRenderer, graphql } from 'react-relay'

import Banner from './Banner'
import Login from './Login'
import Authenticated from './Authenticated'

import './RelayRoot.css'

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
          avatar {
            image48
          }
        }

        title: documents(set: "title") {
          mine {
            text
            found
          }
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
        body = <Login authUrl={`${AUTH_URL}?backTo=%2F`} />
      } else {
        body = <div>{error.message}</div>
      }
    } else if (props) {
      body = <Authenticated />
    } else {
      body = (
        <div className='pushbot-loading'>
          <i className='fa fa-circle-o-notch fa-spin' aria-hidden='true' />
          loading
        </div>
      )
    }

    const username = props && props.me.name
    const title = props && props.title &&
      props.title.mine.found && props.title.mine.text
    const avatar = props && props.me.avatar &&
      props.me.avatar.image48

    return (
      <div>
        <div className='row'>
          <Banner
            username={username}
            title={title}
            avatar={avatar}
          />
        </div>
        {body}
      </div>
    )
  }
}
