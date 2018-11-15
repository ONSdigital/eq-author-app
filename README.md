# eq-author-graphql-schema

[![Greenkeeper badge](https://badges.greenkeeper.io/ONSdigital/eq-author-graphql-schema.svg)](https://greenkeeper.io/)

GraphQL type definitions and schema for [eq-author](https://github.com/ONSdigital/eq-author).

## Publishing

1. Create new branch
2. Make any changes
3. Commit changes
4. Run `npm version [minor|patch|major]`. This will:
    1. Update the package.json version
    2. Commit changes to package.json
    3. Create a git tag
    4. Push changes
5. Create PR
6. Merge PR
7. Pull master
8. Run `npm publish` (ensure you have the correct credentials)



# eq-publisher

[![Greenkeeper badge](https://badges.greenkeeper.io/ONSdigital/eq-publisher.svg)](https://greenkeeper.io/)
An API for publishing [eq-author](http://github.com/ONSDigital/eq-author) questionnaires.

## Oveview

The conversion between the GraphQL JSON output and the EQ runner schema can be thought of as a pipeline.

The conversion pipeline is made up of a series of steps to convert each part of the GraphQL JSON.

Each step applies a series of transforms to manipulate the resulting JSON.

![process.jpg](docs/images/process.png)


## Running with Docker Compose

For convenience, a `docker-compose.yml` configuration is supplied with this project.
The compose file orchestrates the Publisher application and the EQ schema validation service.
A benefit of this approach is that there is no need to run the schema validation service manually.
Using Docker Compose the application can be run using the following command:

```bash
docker-compose up --build
```

**Note that the `--build` flag is only required on first run.**


## Running the service manually

### Installation

To install dependencies, simply run:
```
yarn install
```

### Starting the application

To run the application:
```
yarn start
```

**Note that some [configuration](#environment-variables) may be necessary to run the service in isolation**

## Environment Variables

The following environment variables can be configured.

| Name | Description | Required |
| --- | --- | --- |
| `EQ_SCHEMA_VALIDATOR_URL` | The URL of the schema validation service. See [Running with Docker Compose](#running-with-docker-compose). | Yes |
| `EQ_AUTHOR_API_URL` | The URL of the GraphQL API server | Yes |
| `EQ_PUBLISHER_VERSION` | The current Publisher version. This is what gets reported on the /status endpoint | No |

## Testing

To run all tests:
```
yarn test
```

## Routes

By default, the express server will bind to port `9000`. 

You can then navigate to [http://localhost:9000](http://localhost:9000).

Since the API is still under active development, there are only two routes at present:

| Route  | Description |
| ------------- | ------------- |
| [/graphql/:questionaireId](http://localhost:9000/graphql/1)  | Demonstrates the JSON that is output by the Author API.  |
| [/publish/:questionaireId](http://localhost:9000/publish/1)  | Demonstrates the published EQ JSON.  |


## Debugging

If you have started the app with `docker-compose` then you can attach a debugger. If you use vscode, this is the `launch.json` configuration you must use:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Container",
      "type": "node",
      "request": "attach",
      "port": 5859,
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






[![Build Status](https://travis-ci.org/ONSdigital/eq-author.svg?branch=master)](https://travis-ci.org/ONSdigital/eq-author)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Table of Contents

- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites

- Node.js 7.10.0 or newer
- [Yarn](https://yarnpkg.com/en/)
- Google Chrome

### How to install

- Just run `yarn` to install all dependencies.

## Folder Structure

`/.storybook` Config for storybook.

`/config` Webpack config.

`/data` Example Runner JSON schemas.

`/public` Public static assets.

`/scripts` NPM scripts for running the app.

`/src` JavaScript source files.

`/src/actions` Redux action creators.

`/src/components` React components.

`/src/constants` Constants that can be used throughout the application such as theme colours and action names.

`/src/containers` Redux container components.

`/src/helpers` Helper functions, etc.

`/src/layouts` Layout components.

`/src/pages` Page components rendered via a route.

`/src/reducers` Redux reducer functions.

`/src/schema` Schema for Normalizr.

For the project to build, **these files must exist with exact filenames**:

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn lint`

Lints the `src` directory using the rules defined in `.eslintrc`. Run `yarn lint -- --fix` if you want eslint to fix any issues it can.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

If you would like to collect code coverage run `yarn test -- --coverage`.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `yarn deploy`

Builds (via `yarn build`) and deploys the project to Github Pages.

### `yarn storybook`

Spins up the Storybook development server.

## Environment Variables

### Authentication
| Name | Description | Required |
| --- | --- | --- |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase is used for basic authentication this environment and the two below are needed for this. The project ID for your Firebase project. Can be obtained from your Firebase project | Yes If authentication is enabled |
| `REACT_APP_FIREBASE_API_KEY` | The api key for your Firebase project. Can be obtained from your Firebase project | Yes If authentication is enabled |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | The messaging sender ID for your Firebase project. Can be obtained from your Firebase project | Yes If authentication is enabled |
| `REACT_APP_ENABLE_AUTH` | Used to enable and disable firebase authentication. User can sign in as guest if this is set to false. This is always enabled in the docker images. | Yes |

### Functional
| Name | Description | Required |
| --- | --- | --- |
| `REACT_APP_API_URL` | Set Author API URL | Yes |
| `REACT_APP_LAUNCH_URL` | Set the launch-a-survey target | No |
| `PUBLIC_URL` | The public URL inferred if not provided | No |
| `REACT_APP_BASE_NAME` | Used to build up URL set to "/eq-author" in production | No |

### Testing
| Name | Description | Required |
| --- | --- | --- |
| `CYPRESS_baseUrl` | Set Cypress URL | Yes |
| `CYPRESS_BASE_NAME` | Not used | No |
| `REACT_APP_FUNCTIONAL_TEST` | Run functional test switch | No |

### Third party services
| Name | Description | Required |
| --- | --- | --- |
| `REACT_APP_USE_SENTRY` | Use Sentry for error checking | Yes |
| `REACT_APP_USE_FULLSTORY` | Use fullstory if set to true | No |

### Runtime
| Name | Description | Required |
| --- | --- | --- |
| `HOST` | Set to 0.0.0.0 if not provided | No |
| `PORT` |The port which express listens on (defaults to `3000`). | No |
| `HTTPS` | HTTP/HTTPS Switch | No |

### Build configuration
| Name | Description | Required |
| --- | --- | --- |
| `BABEL_ENV` | Sets the environment the code is running in | Yes |
| `NODE_ENV` | Sets the environment the code is running in | Yes |
| `NODE_PATH` | Folder path for the code folder structure | Yes |
| `CI` | Switch that if is set to true will treat warnings as errors | No |
| `EQ_AUTHOR_VERSION` | The current Author version. This is what gets reported on the /status endpoint | No |

## Authentication

We currently use firebase for basic authentication requirements. The following environment variables are required for firebase:

* `REACT_APP_FIREBASE_PROJECT_ID`
* `REACT_APP_FIREBASE_API_KEY`
* `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`

These can either be passed on command line:

```bash
REACT_APP_FIREBASE_PROJECT_ID=ABC REACT_APP_FIREBASE_API_KEY=DEF REACT_APP_FIREBASE_MESSAGING_SENDER_ID=GHI yarn start
```

Or they can be added to an `.env.development.local` file in the root of the repo:

```
REACT_APP_FIREBASE_PROJECT_ID="ABC"
REACT_APP_FIREBASE_API_KEY="DEF"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="GHI"
```

Note: CLI env vars taken precedence over `.env.development.local` vars. For more information about precedence of config files, see: https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use

### Enabling / disabling authentication

Firebase authentication can be disabled by setting the env var `REACT_APP_ENABLE_AUTH=false`. Disabling firebase authentication allows users to login as a guest.

### Environment variable in different environments

There are two ways we use environment variables in the application:
1. Build time environment variables. These are values that are known at build time and cannot be changed once the docker image is built. Currently these are only `NODE_ENV` and `REACT_APP_AUTH_ENABLED`. These are referenced in the code as `process.env.{key}`
1. Runtime configurable variables. These are values that can change for each place we run the app for example in staging we want the API url to be different to production. In the code these values are read using the config object for example `config.{key}`. 
    - Dev - Values are read from the environment.
    - Docker - Values are read from `window.config` (as defined in `index.html`) and then `process.env`. `index.html` is rewritten in docker to read the available environment variables and pass them to the application every time the docker image starts.

## Testing

### Integration tests

Author's integration testing is run using the Cypress framework and can be run using the following commands provided author is already running with AUTH disabled using the `REACT_APP_ENABLE_AUTH=false` env variable:

* `yarn test:integration`

Launches Cypress on Chrome and automatically runs the default test suite. 

* `yarn cypress:open`

Launches Cypress using the Electron framework and allows for choosing which test to run and a more interactive and detailed testing enviroment.

By default the integration tests will be run against `http://localhost:13000` as configured in the [.env configuration](.env.test). It is possible to point Cypress at another environment by overriding the `CYPRESS_baseUrl` environment variable.

e.g. `CYPRESS_baseUrl=http://some-other-environment yarn cypress:open`

### Filename Conventions

Tests are colocated next to the code they are testing. For example, a test for `/src/components/Button/index.js` could be in a file `/src/components/Button/test.js`.

### Command Line Interface

When you run `yarn test`, Jest will launch in the watch mode. Every time you save a file, it will re-run the tests, just like `yarn start` recompiles the code.

The watcher includes an interactive command-line interface with the ability to run all tests, or focus on a search pattern. It is designed this way so that you can keep it open and enjoy fast re-runs.

# Troubleshooting

## Jest crashing

### Problem

Running `yarn test` causes Jest to crash with the following error:
```
(FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
(FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
(FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
events.js:160
      throw er; // Unhandled 'error' event
      ^

Error: Error watching file for changes: EMFILE
    at exports._errnoException (util.js:1036:11)
    at FSEvent.FSWatcher._handle.onchange (fs.js:1406:11)
```

### Solution

According to [this thread](https://github.com/facebook/jest/issues/1767), install watchman: `brew install watchman`

