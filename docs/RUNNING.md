# Running

## Table of Contents

- [Running components automatically](#running-components-automatically)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Running Components Automatically

### eq-author

The following environment variables should be placed in a .env.[environment] file in the eq-author folder.
| Name                   | Description                             | Required |
| ---------------------- | --------------------------------------- | -------- |
| `REACT_APP_API_URL`    | Set Author API URL                      | Yes      |
| `REACT_APP_LAUNCH_URL` | Set the launch-a-survey target          | No       |
| `PUBLIC_URL`           | The public URL inferred if not provided | No       |

From a terminal open the `eq-author` folder and run  

```bash
yarn start
```  

When the process completes a browser window will be opened pointing to [http://localhost:3000](http://localhost:3000)

The page will reload if you make edits.  You will also see any lint errors in the console.

### eq-author-api

The compose file orchestrates the Publisher application and the EQ schema validation service.
A benefit of this approach is that there is no need to run the schema validation service manually.

From a terminal open the `eq-author-api` folder and run

```bash
docker-compose up --build
```

Changes to the application should hot reload via `nodemon`.

### eq-publisher

From a terminal open the `eq-publisher` folder and run

```bash
docker-compose up --build
```

## Running Components Manually

### Publisher

#### Installation

To install dependencies, simply run:

```bash
yarn install
```

#### Starting the application

To run the application:

```bash
yarn start
```

#### Environment Variables

Note that some Environment Variables may be necessary to run the service in isolation.  The following environment variables can be configured.

| Name                      | Description                                                                                               | Required |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | -------- |
| `EQ_SCHEMA_VALIDATOR_URL` | The URL of the schema validation service. See [Running with Docker Compose](#running-with-docker-compose) | Yes      |
| `EQ_AUTHOR_API_URL`       | The URL of the GraphQL API server                                                                         | Yes      |
| `EQ_PUBLISHER_VERSION`    | The current Publisher version. This is what gets reported on the /status endpoint                         | No       |
