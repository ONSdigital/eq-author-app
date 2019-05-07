# eq-author-api

A GraphQL based API for the [eq-author](https://github.com/ONSdigital/eq-author)
application.

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
| `ENABLE_IMPORT`         | When enabled it exposes a post endpoint for importing questionnaires                                                                                 | No       |

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

Changes to the application should hot reload via `nodemon`.

## Migrations

`runQuestionnaireMigrations` middleware is responsible for updating the schema version and running any necessary migrations.

- `yarn create-migration [name]` will create a new migration in the `/migrations` directory.
- Add the created migration to the bottom of the `migrations/index.js` array.
- `runQuestionnaireMigrations` will execute necessary migrations on every request providing the schema has not already been migrated.

## DynamoDB

### Running DynamoDB GUI locally

To run DynamoDB GUI locally, ensure that you are in the eq-author-api folder and then run:

```
yarn dynamodb-admin
```

Then open <http://localhost:8001/> in the web browser to access the database GUI.

### AWS CLI

To set up AWS access you first need to install [AWS Command Line Interface](https://aws.amazon.com/cli/).

Then follow the [instructions for setting up the CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html).

For available commands, see [reference for CLI](https://docs.aws.amazon.com/cli/latest/index.html).

## Import/Export

It is possible to retrieve the full questionnaire data by making a `GET` request to `/export/:questionnaireId`

When the environment variable `ENABLE_IMPORT` is set to `true` then it exposes `/import` which will take the
`POST` body and save it to the database. It performs no validation as it does this.
