#!/bin/bash

if [[ -z $1 ]]; then
    echo "Base name cannot be empty"
    exit 1
fi

if [[ -z $2 ]]; then
  echo "Action must be provided"
  exit 1
fi

if $(dirname $0)/build-condition.sh $1; then
  if [[ $2 == "integration" && $1 == "eq-author" ]]; then
    echo "onsdigital/${1}:${TRAVIS_BUILD_NUMBER}"
    exit 0
  fi

  if [[ "$TRAVIS_PULL_REQUEST_BRANCH" != "" ]]; then
    echo "onsdigital/${1}:${TRAVIS_PULL_REQUEST_BRANCH}"
    exit 0
  fi
fi

echo "onsdigital/${1}:latest"