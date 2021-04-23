#!/bin/bash
set -e

AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
FIREBASE_PROJECT_ID=test-firebase-id
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=eample

# Sttart mongoDB

MONGO_CONTAINER_ID=$(docker run -tid -P -e MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD mongo)
MONGO_EXPRESS_CONTAINTER_ID=$(docker run -tid -P -e MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD mongo-express)
REDIS_CONTAINER_ID=$(docker run -tid -P redis:5-alpine)

MONGO_PORT=$(docker port $MONGO_CONTAINER_ID 27017)
MONGO_EXPRESS_PORT=$(docker port $MONGO_EXPRESS_CONTAINTER_ID 8081)
REDIS_PORT=$(docker port $REDIS_CONTAINER_ID 6379 | cut -d ':' -f 2)

echo "mongo started at: $MONGO_PORT"
echo "mongo-express started at: $MONGO_EXPRESS_PORT"
echo "redis start at: $REDIS_PORT"

function finish {
  echo "killing docker..."
  docker rm -vf $MONGO_CONTAINER_ID
  docker rm -vf $MONGO_EXPRESS_CONTAINTER_ID
  docker rm -vf $REDIS_CONTAINER_ID
}
trap finish EXIT

<<<<<<< Updated upstream
echo "running tests..."
=======
echo "Waiting for Mongo to start..."

until [ "`docker container inspect --format='{{json .State.Running}}' $MONGO_CONTAINER_ID`"=="false" ]; do
    sleep 0.1;
done;

echo "Waiting on Mongo-Express to start"

echo "Running tests..."
>>>>>>> Stashed changes

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
MONGO_URL=mongodb://root:example@mongo:27017/dev_author?authSource=admin \
yarn jest --runInBand --detectOpenHandles --forceExit "$@"