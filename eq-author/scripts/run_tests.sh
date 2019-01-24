#!/bin/bash

set -euf -o pipefail

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

# Start env
docker-compose -f "$docker_compose" up -d
./node_modules/.bin/wait-on http-get://localhost:14000/status
./node_modules/.bin/wait-on http-get://localhost:13000


if [ "$1" == "integration" ]; then
  integration_folder="cypress/integration";
elif [ "$1" == "routing_e2e" ]; then 
  integration_folder="cypress/routingTests";
else
  integration_folder="cypress/e2e";
fi

cypress_config="watchForFileChanges=false,integrationFolder=$integration_folder"

# Run the tests
if [ -z "${CYPRESS_RECORD_KEY-}" ]; then
  yarn cypress run --browser chrome --config "$cypress_config"
else
  yarn cypress run --browser electron --record --config "$cypress_config" --parallel --group "CI-TEST" &
  worker1_pid=$!
  echo "Worker 1: $worker1_pid"
  # Waiting for first worker to start
  sleep 2
  yarn cypress run --browser electron --record --config "$cypress_config" --parallel --group "CI-TEST" &
  worker2_pid=$!
  echo "Worker 2: $worker2_pid"

  wait "$worker1_pid"
  wait "$worker2_pid"
fi
