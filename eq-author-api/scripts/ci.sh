#!/bin/bash
set -e

# yarn install --frozen-lockfile
# yarn lint --max-warnings=0
# yarn test --coverage
# bash <(curl -s https://codecov.io/bash) -e TRAVIS_NODE_VERSION -c -F api
# yarn test:breakingChanges

docker build -t onsdigital/eq-author-api:$TAG --build-arg APPLICATION_VERSION=$(git rev-parse HEAD) -f Dockerfile .