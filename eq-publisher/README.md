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