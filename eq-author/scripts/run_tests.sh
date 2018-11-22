#!/bin/bash

set -ef -o pipefail

docker_compose="./scripts/test_docker-compose.yml"

function read_vars {
  if [ -f $1 ]; then
    echo "reading env vars: $1"
    export $(egrep -v '^#' $1 | xargs) > /dev/null
  fi
}

function dotenv {
  environment=${NODE_ENV:-test}

  read_vars ".env.$environment"
  read_vars ".env.$environment.local"
}

# Read env vars
dotenv

function finish {
  echo "Shutting down the server..."

  echo "stopping docker containers"
  docker-compose -f "$docker_compose" down
}
trap finish INT KILL TERM EXIT

if [ $CI  == "true" ]; then
  AUTHOR_IMAGE=`../.travis/image-name.sh "eq-author" $1`
  echo "Author image: $AUTHOR_IMAGE"
  docker pull $AUTHOR_IMAGE

  AUTHOR_API_IMAGE=`../.travis/image-name.sh "eq-author-api" $1`
  echo "API image: $AUTHOR_API_IMAGE"
  docker pull $AUTHOR_API_IMAGE

  PUBLISHER_IMAGE=`../.travis/image-name.sh "eq-publisher" $1`
  echo "Publisher image: $PUBLISHER_IMAGE"
  docker pull $PUBLISHER_IMAGE
fi

# Start env
docker-compose -f "$docker_compose" build
docker-compose -f "$docker_compose" up -d
./node_modules/.bin/wait-on http-get://localhost:14000/status
./node_modules/.bin/wait-on http-get://localhost:13000

if [ "$1" == "integration" ]; then
  integration_folder="cypress/integration";
else
  integration_folder="cypress/e2e";
fi

cypress_config="watchForFileChanges=false,integrationFolder=$integration_folder"

# Run the tests
if [ -z "${CYPRESS_RECORD_KEY-}" ]; then
  yarn cypress run --browser chrome --config "$cypress_config"
else
  yarn cypress run --browser electron --record --config "$cypress_config"
fi
