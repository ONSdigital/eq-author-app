#!/bin/bash
set -euf

echo "Building author..."
pushd eq-author
yarn install --frozen-lockfile
REACT_APP_EQ_AUTHOR_VERSION=$EQ_AUTHOR_VERSION yarn build
popd