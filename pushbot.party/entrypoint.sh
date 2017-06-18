#!/bin/sh

set -eu

printf ".. Linting\n"
npm run lint

printf ".. Building\n"
npm run build
