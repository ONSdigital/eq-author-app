#!/bin/bash
set -e

yarn install --frozen-lockfile
yarn lint
yarn test --coverage
bash <(curl -s https://codecov.io/bash) -e TRAVIS_NODE_VERSION
yarn test:storybook
yarn storybook-build
EQ_AUTHOR_VERSION=$(git rev-parse HEAD) yarn build
docker build -t onsdigital/eq-author:$TAG .