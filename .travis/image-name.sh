#!/bin/bash

if [[ -z $1 ]]; then
    echo "Base name cannot be empty"
    exit 1
fi

if $(dirname $0)/build-condition.sh $1; then
  echo "has changes $TRAVIS_PULL_REQUEST_BRANCH"
  if [[ "$TRAVIS_PULL_REQUEST_BRANCH" != "" ]]; then
    echo "onsdigital/${1}:${TRAVIS_PULL_REQUEST_BRANCH}"
  else
    echo "onsdigital/${1}:latest"
  fi
else
  echo "onsdigital/${1}:latest"
fi