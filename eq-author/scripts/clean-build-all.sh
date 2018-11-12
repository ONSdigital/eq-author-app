#/bin/bash

yarn cache clean

cd ../eq-author-graphql-schema
rm -Rf node_modules
yarn
cd -

cd ../eq-author-api
docker ps -aq | xargs docker rm -vf
rm -Rf node_modules
yarn
docker-compose build
cd -

rm -Rf node_modules
yarn
