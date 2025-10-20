#!/bin/bash
set -e

AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
FIREBASE_PROJECT_ID=test-firebase-id

echo "starting docker..."

REDIS_CONTAINER_ID=$(docker run -tid -P redis:8.2.2-alpine)
REDIS_PORT=$(docker port $REDIS_CONTAINER_ID 6379 | cut -d ':' -f 2)

echo "redis start at: $REDIS_PORT"

function finish {
  echo "killing docker..."
  docker rm -vf $REDIS_CONTAINER_ID
}
trap finish EXIT

echo "running tests..."

AWS_REGION=${AWS_REGION} \
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
ENABLE_IMPORT=true \
ENABLE_OPENTRACING=false \
FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID} \
REDIS_DOMAIN_NAME=0.0.0.0 \
REDIS_PORT=${REDIS_PORT} \
SURVEY_REGISTER_URL=http://host.docker.internal:8080/submit/ \
DATABASE=mongodb \
NODE_ENV=test \
yarn jest --runInBand --detectOpenHandles --forceExit "$@"