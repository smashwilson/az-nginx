#!/bin/bash

set -euo pipefail

pushd pushbot.party
printf "building static content for pushbot.party\n"
docker build -t pushbot-party:latest .

docker run --rm \
  --volume $(pwd)/build/:/usr/src/app/build/ \
  pushbot-party:latest
popd
