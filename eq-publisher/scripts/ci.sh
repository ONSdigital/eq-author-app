#!/bin/bash
set -e

yarn install --frozen-lockfile
yarn lint
yarn test --coverage
bash <(curl -s https://codecov.io/bash) -e TRAVIS_NODE_VERSION -c -F publisher
docker build -t onsdigital/eq-publisher:$TAG --build-arg APPLICATION_VERSION=$(git rev-parse HEAD) -f Dockerfile .