#!/bin/bash
set -e

AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
DYNAMO_QUESTIONNAIRE_TABLE_NAME=test-author-questionnaires
DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME=test-author-questionnaire-versions
DYNAMO_COMMENTS_TABLE_NAME=test-author-comments
DYNAMO_USER_TABLE_NAME=test-author-users
FIREBASE_PROJECT_ID=test-firebase-id

echo "starting Dynamo docker..."

DYNAMO_CONTAINER_ID=$(docker run -tid -P -e AWS_REGION=$AWS_REGION -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY amazon/dynamodb-local)
DYNAMO_HOST=$(docker port $DYNAMO_CONTAINER_ID 8000)

REDIS_CONTAINER_ID=$(docker run -tid -P redis:5-alpine)
REDIS_PORT=$(docker port $REDIS_CONTAINER_ID 6379 | cut -d ':' -f 2)

echo "dynamo started at: $DYNAMO_HOST"
echo "redis start at: $REDIS_PORT"

function finish {
  echo "killing docker..."
  docker rm -vf $DYNAMO_CONTAINER_ID
  docker rm -vf $REDIS_CONTAINER_ID
}
trap finish EXIT

echo "waiting on Dynamo to start..."

./node_modules/.bin/wait-on -d 2000 -t 10000 http://$DYNAMO_HOST/shell

echo "running tests..."

AWS_REGION=${AWS_REGION} \
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
DYNAMO_ENDPOINT_OVERRIDE=http://${DYNAMO_HOST} \
DYNAMO_QUESTIONNAIRE_TABLE_NAME=${DYNAMO_QUESTIONNAIRE_TABLE_NAME} \
DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME=${DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME} \
DYNAMO_COMMENTS_TABLE_NAME=${DYNAMO_COMMENTS_TABLE_NAME} \
ENABLE_IMPORT=true \
DYNAMO_USER_TABLE_NAME=${DYNAMO_USER_TABLE_NAME} \
ENABLE_OPENTRACING=false \
FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID} \
REDIS_DOMAIN_NAME=0.0.0.0 \
REDIS_PORT=${REDIS_PORT} \
SURVEY_REGISTER_URL=http://host.docker.internal:8080/submit/ \
DATABASE=dynamodb \
yarn jest --runInBand --detectOpenHandles --forceExit "$@"