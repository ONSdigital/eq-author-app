#!/bin/bash
set -e

yarn install --frozen-lockfile
yarn lint
yarn coverage
bash <(curl -s https://codecov.io/bash) -e TRAVIS_NODE_VERSION
yarn test:storybook
yarn storybook-build
docker build -t onsdigital/eq-author:$TRAVIS_BUILD_NUMBER --build-arg APPLICATION_VERSION=$(git rev-parse HEAD) -f Dockerfile .
wait
yarn test:integration

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
export TAG=`if [ "$TRAVIS_PULL_REQUEST_BRANCH" == "" ]; then echo "latest"; else echo $TRAVIS_PULL_REQUEST_BRANCH; fi`
export TAG=${TAG//\//-}
docker tag onsdigital/eq-author:$TRAVIS_BUILD_NUMBER onsdigital/eq-author:$TAG
echo "Pushing with tag [$TAG]"
docker push onsdigital/eq-author:$TAG