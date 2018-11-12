#!/bin/bash
set -e

POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=postgres

echo "starting postgres docker..."

CONTAINER_ID=$(docker run -tid -P -e POSTGRES_USER=$POSTGRES_USER -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e POSTGRES_DB=$POSTGRES_DB postgres:9.4-alpine)
POSTGRES_HOST=$(docker port $CONTAINER_ID 5432)
POSTGRES_PORT=$(echo $POSTGRES_HOST | awk -F: '{print $NF}')

echo "docker started at: $POSTGRES_HOST"

function finish {
  echo "killing docker..."
  docker rm -vf $CONTAINER_ID
}
trap finish EXIT

echo "waiting on postgres to start..."

./node_modules/.bin/wait-for-postgres --quiet --port $POSTGRES_PORT --password $POSTGRES_PASSWORD

echo "running tests..."

NODE_ENV=test DB_CONNECTION_URI="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/postgres" yarn jest --runInBand "$@"
