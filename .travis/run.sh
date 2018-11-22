#!/bin/bash
set -e

if ./build-conditions.sh $1; then
  pushd $1
  ./scripts/ci.sh
  popd
fi
