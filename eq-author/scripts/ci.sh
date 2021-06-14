#!/bin/bash
set -e

yarn install --frozen-lockfile
yarn lint
yarn test --coverage
REACT_APP_EQ_AUTHOR_VERSION=$(git rev-parse HEAD) yarn build
docker build -t onsdigital/eq-author:$TAG .
