# eq-publisher

An API for publishing [Author](https://github.com/ONSdigital/eq-author-app) questionnaires.

## Overview

The conversion between the GraphQL JSON output and the EQ runner schema can be thought of as a pipeline.

The conversion pipeline is made up of a series of steps to convert each part of the GraphQL JSON.

Each step applies a series of transforms to manipulate the resulting JSON.

The final validate process is passed on to [eq-schema-validator](https://github.com/ONSdigital/eq-schema-validator).

![eq-publisher process](../docs/images/publisher_process.png)

## Running

### Running with Docker Compose

For convenience, a `docker-compose.yml` configuration is supplied with this project.
The compose file orchestrates the Publisher application and the EQ schema validation service.
A benefit of this approach is that there is no need to run the schema validation service manually.

From a terminal open the `eq-publisher` folder and run

```bash
docker-compose up --build
```

The `--build` flag is only required on the first run.

### Running with Yarn

> Note that some [environment variables](#environment-variables) may be necessary to run the service in isolation.

`yarn install` - Will install dependencies.

`yarn start` - Will start the application.

## Environment Variables

The following environment variables can be configured.

| Name                      | Description                                                                                               | Required |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | -------- |
| `EQ_SCHEMA_VALIDATOR_URL` | The URL of the schema validation service. See [Running with Docker Compose](#running-with-docker-compose) | Yes      |
| `EQ_AUTHOR_API_URL`       | The URL of the GraphQL API server                                                                         | Yes      |
| `EQ_PUBLISHER_VERSION`    | The current Publisher version. This is what gets reported on the /status endpoint                         | No       |

Note that some Environment Variables may be necessary to run the service in isolation. The following environment variables can be configured.

## Running tests

`yarn test` - Will run all tests.

## Routes

By default, the express server will bind to port `9000`.

You can then navigate to <http://localhost:9000>.

Since the API is still under active development, there are only two routes at present:

| Route                                                       | Description                                            |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| [/graphql/:questionaireId](http://localhost:9000/graphql/1) | Demonstrates the JSON that is output by the Author API |
| [/publish/:questionaireId](http://localhost:9000/publish/1) | Demonstrates the published EQ JSON                     |
