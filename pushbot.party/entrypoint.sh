#!/bin/sh

set -eu

printf "\n.. Linting\n\n"
npm run lint

printf "\n.. Invoking Relay compiler\n\n"
npm run relay-compiler

printf "\n.. Building\n\n"
npm run build
