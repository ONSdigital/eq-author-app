#!/bin/bash

if [[ -z $1 ]]; then
    echo "Base name cannot be empty"
    exit 1
fi

if ./build-condition.sh $1; then
  if [[ "$TRAVIS_PULL_REQUEST_BRANCH" != "" ]]; then
    echo "onsdigital/${1}:${TRAVIS_PULL_REQUEST_BRANCH}"
  else
    echo "onsdigital/${1}:latest"
  fi
else
  echo "onsdigital/${1}:latest"
fi