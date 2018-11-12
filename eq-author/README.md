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

