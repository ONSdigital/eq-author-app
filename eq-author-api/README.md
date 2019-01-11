# eq-author-api

A GraphQL based API for the [eq-author](https://github.com/ONSdigital/eq-author)
application.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Run using Docker](#run-using-docker)
- [Tests](#tests)
- [Debugging (with VS Code)](#debugging-with-vs-code)
- [Importing Questionnaires)](#importing-questionnaires)

## Installation

### Configuration

Environment variables can be used to configure various aspects of the API.
In most cases sensible defaults have been selected.

> **Tip**
>
> If you decide to run the Author API directly using `yarn` you will need to
> ensure that the environment variables listed below are configured appropriately.
>
> The `docker-compose` configuration should ensure that all required environment variables are set up correctly so there
> should be no need to manually configure the environment variables when [running with docker compose](#run-using-docker).

## Environment Variables

| Name                    | Description                                                                                                                                          | Required |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `RUNNER_SESSION_URL`    | Authentication URL for survey runner                                                                                                                 | Yes      |
| `PUBLISHER_URL`         | URL that produces valid survey runner JSON                                                                                                           | Yes      |
| `SECRETS_S3_BUCKET`     | Name of S3 bucket where secrets are stored                                                                                                           | No       |
| `KEYS_FILE`             | Name of the keys file to use inside the bucket                                                                                                       | No       |
| `AUTH_HEADER_KEY`       | Name of the header values that contains the Auth token                                                                                               | No       |
| `EQ_AUTHOR_API_VERSION` | The current Author API version. This is what gets reported on the /status endpoint                                                                   | No       |
| `PORT`                  | The port which express listens on (defaults to `4000`)                                                                                               | No       |
| `NODE_ENV`              | Sets the environment the code is running in                                                                                                          | No       |
| `DATASTORE`             | Sets place we store the data, allows us to have the data stored locally in JSON files which makes debugging easier (for this set it to `filesystem`) | No       |

## Run using Docker

To build and run the Author GraphQL API inside a docker container, ensure that
Docker is installed for your platform, navigate to the project directory, then run:

Build the docker image (1st time run):

```
docker-compose build
```

```
docker-compose up
```

Once the containers are running you should be able to navigate to http://localhost:4000/graphiql and begin exploring the eQ Author GraphQL API.

Changes to the application should hot reload via `nodemon`.

### Querying pages

There is no concrete `Page` type in the GraphQL schema. Instead we use a `Page` interface, which other types implement e.g. `QuestionPage` and `InterstitialPage`.

To query all pages, and request different fields depending on the type, use [inline fragments](http://graphql.org/learn/queries/#inline-fragments):

```gql
query {
  getQuestionnaire(id: 1) {
    questionnaire {
      sections {
        pages {
          id

          # inline fragment for `QuestionPage` type
          ... on QuestionPage {
            guidance
            answers {
              id
              label
            }
          }

          # For purposes of example only. `InterstitialPage` doesn't exist yet
          ... on InterstitialPage {
            # doesn't exist yet
            someField
          }
        }
      }
    }
  }
}
```

### Testing through GraphiQL

There are [queries](tests/fixtures/queries.gql) and [example data](tests/fixtures/data.json) in the [fixtures folder](tests/fixtures). These can be used with graphiql to manually build up a questionnaire.

## Tests

`yarn test` will start a single run of unit and integration tests.

`yarn test --watch` will start unit and integration tests in watch mode.

## Debugging (with VS Code)

### Debugging app

Follow [this guide](https://github.com/docker/labs/blob/83514855aff21eaed3925d1fd28091b23de0e147/developer-tools/nodejs-debugging/VSCode-README.md) to enable debugging through VS Code.

Use this config for VS Code, rather than what is detailed in the guide. This will attach _to the running docker container_:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Container",
      "type": "node",
      "request": "attach",
      "port": 5858,
      "address": "localhost",
      "restart": true,
      "sourceMaps": false,
      "localRoot": "${workspaceRoot}",
      "remoteRoot": "/app",
      "protocol": "inspector"
    }
  ]
}
```

### Debugging tests

Add the following to your `launch.json` configuration:

```json
{
  "name": "Attach by Process ID",
  "type": "node",
  "request": "attach",
  "processId": "${command:PickProcess}"
}
```

Then start your tests [as described above](#tests). You can now start a debugging session, and pick the jest process to attach to.
