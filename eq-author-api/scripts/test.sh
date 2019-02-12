#!/bin/bash
set -e

echo "starting Dynamo docker..."

CONTAINER_ID=$(docker run -tid -P amazon/dynamodb-local)
DYNAMO_HOST=$(docker port $CONTAINER_ID 8000)
DYNAMO_PORT=$(echo $DYNAMO_HOST | awk -F: '{print $NF}')

echo "docker started at: $DYNAMO_HOST"

function finish {
  echo "killing docker..."
  docker rm -vf $CONTAINER_ID
}
trap finish EXIT

echo "waiting on Dynamo to start..."

./node_modules/.bin/wait-on http://$DYNAMO_HOST/shell

echo "running tests..."

SILENCE_LOGS=true yarn jest --runInBand --detectOpenHandles --forceExit "$@"
