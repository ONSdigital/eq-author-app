# Testing

## Front End

### Environment Variables eq-author

| Name                        | Description                | Required |
| --------------------------- | -------------------------- | -------- |
| `CYPRESS_baseUrl`           | Set Cypress URL            | Yes      |
| `REACT_APP_FUNCTIONAL_TEST` | Run functional test switch | No       |

In the project directory, you can run:

### `yarn lint`

Lints the `src` directory using the rules defined in `.eslintrc`. Run `yarn lint -- --fix` if you want eslint to fix any issues it can.

### `yarn test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](#running-tests) for more information.

If you would like to collect code coverage run `yarn test -- --coverage`.

### Integration tests

Author's integration testing is run using the Cypress framework and can be run using the following commands:

- `yarn test:integration`

Launches Cypress on Chrome and automatically runs the default test suite.

- `yarn cypress:open`

Launches Cypress using the Electron framework and allows for choosing which test to run and a more interactive and detailed testing enviroment.

By default the integration tests will be run against `http://localhost:13000` as configured in the [.env configuration](.env.test). It is possible to point Cypress at another environment by overriding the `CYPRESS_baseUrl` environment variable.

e.g. `CYPRESS_baseUrl=http://some-other-environment yarn cypress:open`

### Filename Conventions

Tests are colocated next to the code they are testing. For example, a test for `/src/components/Button/index.js` could be in a file `/src/components/Button/test.js`.

### Command Line Interface

When you run `yarn test`, Jest will launch in the watch mode. Every time you save a file, it will re-run the tests, just like `yarn start` recompiles the code.

The watcher includes an interactive command-line interface with the ability to run all tests, or focus on a search pattern. It is designed this way so that you can keep it open and enjoy fast re-runs.

## EQ API

### Testing through GraphiQL

There are [queries](tests/fixtures/queries.gql) and [example data](tests/fixtures/data.json) in the [fixtures folder](tests/fixtures). These can be used with graphiql to manually build up a questionnaire.

### DB migrations

First start app using Docker.

#### Create migration

```bash
yarn knex migrate:make name_of_migration
```

Where `name_of_migration` is the name you wish to use. e.g. `create_questionnaires_table`

#### Apply migrations

```bash
docker-compose exec web yarn knex migrate:latest
```

#### Rollback migrations

```bash
docker-compose exec web yarn knex migrate:rollback
```

### Tests

`yarn test` will start a single run of unit and integration tests.

`yarn test --watch` will start unit and integration tests in watch mode.

### Importing questionnaires

There is a dev only endpoint exposed in the dev environment to be able to import questionnaires from other environments.

#### How to use it

1. Run the following query against the environment to retrieve the questionnaire. You need to provide the id as well. (You could use <https://github.com/skevy/graphiql-app>)  
[query examples](/eq-publisher/src/queries.js)

2. `POST` the result to `/import`. (You could use <https://www.getpostman.com/>)
3. The questionnaire should be there.

## EQ Publisher

To run all tests:

```bash
yarn test
```
