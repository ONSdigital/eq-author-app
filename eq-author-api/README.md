# eq-author-api

[![Greenkeeper badge](https://badges.greenkeeper.io/ONSdigital/eq-author-api.svg)](https://greenkeeper.io/)

A GraphQL based API for the [eq-author](https://github.com/ONSdigital/eq-author)
application.

## Installation

### Configuration

Environment variables can be used to configure various aspects of the API.
In most cases sensible defaults have been selected.

> **Tip**
>
> If you decide to run the Author API directly using `yarn` you will need to
> ensure that a suitable database instance is running and configure the
> associated database environment variables appropriately.
>
> Running using `docker-compose` will ensure that a suitable postgres instance
> is started. So there is no need to configure the environment variables.

## Environment Variables

| Name | Description | Required |
| --- | --- | --- |
| `RUNNER_SESSION_URL` | Authentication URL for survey runner | Yes |
| `PUBLISHER_URL` | URL that produces valid survey runner JSON | Yes |
| `DB_CONNECTION_URI` | Connection string for database | Yes |
| `SECRETS_S3_BUCKET` | Name of S3 bucket where secrets are stored | No |
| `KEYS_FILE` | Name of the keys file to use inside the bucket | No |
| `EQ_AUTHOR_API_VERSION` | The current Author API version. This is what gets reported on the /status endpoint | No |
| `PORT` | The port which express listens on (defaults to `4000`). | No |
| `NODE_ENV` | Sets the environment the code is running in | No |

### Run using Docker

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
          id,

          # inline fragment for `QuestionPage` type
          ... on QuestionPage {
            guidance,
            answers {
              id,
              label
            }
          },

          # For purposes of example only. `InterstitialPage` doesn't exist yet
          ... on InterstitialPage { # doesn't exist yet
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

### DB migrations

First start app using Docker.

#### Create migration

```
yarn knex -- migrate:make name_of_migration
```

Where `name_of_migration` is the name you wish to use. e.g. `create_questionnaires_table`

#### Apply migrations

```
docker-compose exec web yarn knex -- migrate:latest
```

#### Rollback migrations

```
docker-compose exec web yarn knex -- migrate:rollback
```

## Tests

`yarn test` will start a single run of unit and integration tests.

`yarn test --watch` will start unit and integration tests in watch mode.

## Debugging (with VS Code)

### Debugging app

Follow [this guide](https://github.com/docker/labs/blob/83514855aff21eaed3925d1fd28091b23de0e147/developer-tools/nodejs-debugging/VSCode-README.md) to enable debugging through VS Code. 

Use this config for VS Code, rather than what is detailed in the guide. This will attach *to the running docker container*:

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

## Importing questionnaires
There is a dev only endpoint exposed in the dev environment to be able to import questionnaires from other environments.

## How to use it:
1. Run the following query against the environment to retrieve the questionnaire. You need to provide the id as well. (You could use https://github.com/skevy/graphiql-app)
```graphql
fragment answerFragment on Answer {
  id
  type
  label
  description
  guidance
  properties
  qCode
  ...on BasicAnswer{
    validation{
      ...on NumberValidation{
        minValue{
          id
          inclusive
          enabled
          custom
        }
        maxValue{
          id
          inclusive
          enabled
          custom
          entityType
          previousAnswer {
            id
          }
        }
      }
      ...on DateValidation{
        earliestDate{
          id
          enabled
          custom
          offset {
            value
            unit
          }
          relativePosition
        }
        latestDate{
          id
          enabled
          custom
          offset {
            value
            unit
          }
          relativePosition
        }
      }
    }
  }
  ...on CompositeAnswer{
    childAnswers{
      id
      label
    }
  }
}

fragment optionFragment on Option {
  id
  label
  description
  value
  qCode
}

fragment destinationFragment on RoutingDestination {
  ... on LogicalDestination {
    __typename
    logicalDestination
  }
  ... on AbsoluteDestination {
    __typename
    absoluteDestination {
      ... on QuestionPage {
        id
        __typename
      }
      ... on Section {
        id
        __typename
      }
    }
  }
}

fragment metadataFragment on Metadata {
  id
  key
  type
}

query GetQuestionnaire($questionnaireId: ID!) {
  questionnaire(id: $questionnaireId) {
    id
    title
    description
    theme
    legalBasis
    navigation
    surveyId
    summary
    metadata {
      ...metadataFragment
    }
    sections {
      id
      alias
      title
      description
      pages {
        ... on QuestionPage {
          id
          alias
          title
          description
          guidance
          pageType
          routingRuleSet {
            id
            else {
              ...destinationFragment
            }
            routingRules {
              id
              operation
              goto {
                ...destinationFragment
              }
              conditions {
                id
                comparator
                answer {
                  id
                  type
                  ... on MultipleChoiceAnswer {
                    options {
                      id
                      label
                    }
                    other {
                      option {
                        id
                        label
                      }
                    }
                  }
                }
                routingValue {
                  ... on IDArrayValue {
                    value
                  }
                  ... on NumberValue {
                    numberValue
                  }
                }
              }
            }
          }
          answers {
            ...answerFragment
            ... on MultipleChoiceAnswer {
              options {
                ...optionFragment
              }
              mutuallyExclusiveOption {
                ...optionFragment
              }
              other {
                option {
                  ...optionFragment
                }
                answer {
                  ...answerFragment
                }
              }
            }
          }
        }
      }
    }
  }
}
```
1.`POST` the result to `/import`. (You could use https://www.getpostman.com/)
1. The questionnaire should be there.
