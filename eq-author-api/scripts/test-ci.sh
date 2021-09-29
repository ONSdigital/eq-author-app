#!/bin/bash
set -e

AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
FIREBASE_PROJECT_ID=test-firebase-id

echo "running tests...."

AWS_REGION=${AWS_REGION} \
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
ENABLE_IMPORT=true \
ENABLE_OPENTRACING=false \
FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID} \
REDIS_DOMAIN_NAME=redis\
REDIS_PORT=6379 \
SURVEY_REGISTER_URL=http://host.docker.internal:8080/submit/ \
DATABASE=mongodb \
NODE_ENV=test \
yarn jest --runInBand --detectOpenHandles --forceExit "$@"