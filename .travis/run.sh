#!/bin/bash
set -e

if .travis/build-condition.sh $1; then
  pushd $1
  ./scripts/ci.sh
  popd
fi
