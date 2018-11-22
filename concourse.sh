#!/bin/bash
set -euf

echo "Building author..."
pushd eq-author
yarn install --frozen-lockfile
yarn build
popd