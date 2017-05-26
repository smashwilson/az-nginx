#!/bin/sh

export IMAGE_BASE="quay.io/smashwilson/azurefire-nginx"

BRANCH=
if [ "${TRAVIS_PULL_REQUEST:-}" = "false" ]; then
  if [ "${TRAVIS_BRANCH:-}" = "master" ]; then
    BRANCH="latest"
  else
    BRANCH="${TRAVIS_BRANCH:-}"
  fi
elif [ -n "${TRAVIS_PULL_REQUEST:-}" ]; then
  BRANCH="pr${TRAVIS_PULL_REQUEST}"
else
  BRANCH="local"
fi

export IMAGE_TAG="${IMAGE_BASE}:${BRANCH}"
