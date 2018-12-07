#!/bin/bash
set -e

yarn install --frozen-lockfile
yarn lint --max-warnings=0
yarn test:coverage
bash <(curl -s https://codecov.io/bash) -e TRAVIS_NODE_VERSION
yarn test:breakingChanges

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
export TAG=`if [ "$TRAVIS_PULL_REQUEST_BRANCH" == "" ]; then echo "latest"; else echo $TRAVIS_PULL_REQUEST_BRANCH; fi`
export TAG=${TAG//\//-}
docker build -t onsdigital/eq-author-api:$TAG --build-arg APPLICATION_VERSION=$(git rev-parse HEAD) -f Dockerfile .
echo "Pushing with tag [$TAG]"
docker push onsdigital/eq-author-api:$TAG