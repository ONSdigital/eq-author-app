# eq-author-api

A GraphQL based API for the [eq-author](https://github.com/ONSdigital/eq-author)
application.

## Running

### Running with Docker Compose

> The `docker-compose` configuration should ensure that all required environment variables are set up correctly so there should be no need to manually configure the environment variables when running with docker compose.

To build and run the Author GraphQL API inside a docker container, ensure that
Docker is installed for your platform, navigate to the project directory, then run:

```bash
docker-compose up --build
```

The `--build` flag is only required on the first run.

Changes to the application should hot reload via `nodemon`.

### Running with Yarn

> If you decide to run the Author API directly using `yarn` you will need to ensure that the environment variables listed below are configured appropriately.

## Environment Variables

| Name                    | Description                                                                        | Required |
| ----------------------- | ---------------------------------------------------------------------------------- | -------- |
| `RUNNER_SESSION_URL`    | Authentication URL for survey runner                                               | Yes      |
| `PUBLISHER_URL`         | URL that produces valid survey runner JSON                                         | Yes      |
| `FIREBASE_PROJECT_ID`   | The project ID for your Firebase project.                                          | Yes      |
| `SECRETS_S3_BUCKET`     | Name of S3 bucket where secrets are stored                                         | No       |
| `KEYS_FILE`             | Name of the keys file to use inside the bucket                                     | No       |
| `AUTH_HEADER_KEY`       | Name of the header values that contains the Auth token                             | No       |
| `EQ_AUTHOR_API_VERSION` | The current Author API version. This is what gets reported on the /status endpoint | No       |
| `PORT`                  | The port which express listens on (defaults to `4000`)                             | No       |
| `NODE_ENV`              | Sets the environment the code is running in                                        | No       |
| `ENABLE_IMPORT`         | When enabled it exposes a post endpoint for importing questionnaires               | No       |

## Running tests

`yarn test` will start a single run of unit and integration tests.

`yarn test --watch` will start unit and integration tests in watch mode.

## Querying pages

There is no concrete `Page` type in the GraphQL schema. Instead we use a `Page` interface, which other types implement e.g. `QuestionPage` and `InterstitialPage`.

To query all pages, and request different fields depending on the type, use [inline fragments](https://graphql.org/learn/queries/#inline-fragments):

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

## Creating a new migration

- `yarn create-migration [name]` will create a new migration in the `/migrations` directory.
- Add the created migration to the bottom of the `migrations/index.js` array.
- `runQuestionnaireMigrations` will execute necessary migrations on every request providing the schema has not already been migrated.

## Running bulk migration

The following script is used for bulk migrations. Before running the command, replace `env` with your environment variables. Remember to have `aws configure` pointing at the right environment, and be on master branch with the latest changes before doing this.

`DYNAMO_QUESTIONNAIRE_TABLE_NAME="env-author-questionnaires" AWS_REGION="eu-west-1" DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME="env-author-questionnaire-versions" DYNAMO_USER_TABLE_NAME="env-author-users" node scripts/bulkMigrateDataStore.js`

## Import/Export Questionnaires

It is possible to retrieve the full questionnaire data by making a `GET` request to `/export/:questionnaireId`

When the environment variable `ENABLE_IMPORT` is set to `true` then it exposes `/import` which will take the
`POST` body and save it to the database. It performs no validation as it does this.

## Instrumentation and tracing

Instrumenting the GraphQL API is useful for troubleshooting errors and to help identify the root cause of slow running queries and mutations.

The Author GraphQL API can be instrumented using [opentracing](https://opentracing.io) via the [apollo-opentracing](https://www.npmjs.com/package/apollo-opentracing) package.

To enable instrumentation and to allow request tracing set the environment variable `ENABLE_OPENTRACING=true`. For convenience the [docker-compose.yml](docker-compose.yml) configuration that has been pre-configured to instrument the API, produce tracing metrics using [Prometheus](https://prometheus.io/) and collect the tracing output using [Jaeger](https://www.npmjs.com/package/jaeger-client).

This configuration is only intended for local development and should not be used for production.

To run the author API with instrumentation and request tracing enabled, simply run:

```bash
docker-compose up
```

Once running, the trace metrics and spans can be viewed by browsing to the Jaeger UI which is exposed on port `16686`.

<http://localhost:16686>
