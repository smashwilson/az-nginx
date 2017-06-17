#!/usr/bin/env node
const fs = require('fs')
const fetch = require('node-fetch')
const {
  buildClientSchema,
  introspectionQuery,
  printSchema,
} = require('graphql/utilities')

const paths = require('../config/paths')
const SERVER = 'https://api.pushbot.party/graphql'

console.log(introspectionQuery)

// Save JSON of full schema introspection for Babel Relay Plugin to use
fetch(SERVER, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({query: introspectionQuery}),
}).then(res => res.json()).then(schemaJSON => {
  const graphQLSchema = buildClientSchema(schemaJSON.data)
  fs.writeFileSync(paths.schemaGraphQL, printSchema(graphQLSchema))
}).catch(err => console.error(err))
