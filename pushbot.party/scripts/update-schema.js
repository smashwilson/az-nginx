#!/usr/bin/env node
const fs = require('fs')
const fetch = require('node-fetch')
const paths = require('../config/paths')

const URL = 'https://github.com/smashwilson/pushbot/raw/master/scripts/api/schema.graphql'

fetch(URL)
.then(response => response.text())
.then(text => {
  fs.writeFileSync(paths.schemaGraphQL, text, {encoding: 'utf8'})
})
