#!/bin/bash
set -e

yarn install --frozen-lockfile
yarn lint
yarn test --coverage
docker build -t onsdigital/eq-publisher:$TAG --build-arg APPLICATION_VERSION=$(git rev-parse HEAD) -f Dockerfile .