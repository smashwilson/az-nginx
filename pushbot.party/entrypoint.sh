#!/bin/sh

set -eu

printf "\n.. Linting\n"
npm run lint

printf "\n.. Invoking Relay compiler\n"
npm run relay-compiler

printf "\n.. Building\n"
npm run build
