#!/bin/bash
set -e

AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
DYNAMO_QUESTIONNAIRE_TABLE_NAME=test-author-questionnaires
DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME=test-author-questionnaire-versions
DYNAMO_USER_TABLE_NAME=test-author-users

echo "starting Dynamo docker..."

CONTAINER_ID=$(docker run -tid -P -e AWS_REGION=$AWS_REGION -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY amazon/dynamodb-local)
DYNAMO_HOST=$(docker port $CONTAINER_ID 8000)

echo "docker started at: $DYNAMO_HOST"

function finish {
  echo "killing docker..."
  docker rm -vf $CONTAINER_ID
}
trap finish EXIT

echo "waiting on Dynamo to start..."

./node_modules/.bin/wait-on http://$DYNAMO_HOST/shell

echo "running tests..."

AWS_REGION=${AWS_REGION} \
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
DYNAMO_ENDPOINT_OVERRIDE=http://${DYNAMO_HOST} \
DYNAMO_QUESTIONNAIRE_TABLE_NAME=${DYNAMO_QUESTIONNAIRE_TABLE_NAME} \
DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME=${DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME} \
ENABLE_IMPORT=true \
DYNAMO_USER_TABLE_NAME=${DYNAMO_USER_TABLE_NAME} \
yarn jest --runInBand --detectOpenHandles --forceExit "$@"