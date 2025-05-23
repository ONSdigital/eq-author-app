# eq-author

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running with Yarn

`yarn` - Will install all dependencies.

`yarn start` - Will start the application in development mode. Open <http://localhost:3000> to view it in the browser.

`yarn lint` - Lints the `src` directory using the rules defined in `.eslintrc`.

`yarn lint -- --fix` - If you want eslint to fix any issues it can.

`yarn build` - Builds the app for production to the `build` folder. See [Creating a Production Build](https://facebook.github.io/create-react-app/docs/production-build) for more information.

`yarn test` - Launches the test runner in the interactive watch mode.

`yarn test -- --coverage` - Collects code coverage in `./coverage` folder.

## Environment Variables

### Runtime

| Name    | Description                                             | Required |
| ------- | ------------------------------------------------------- | -------- |
| `HOST`  | Set to 0.0.0.0 if not provided                          | No       |
| `PORT`  | The port which express listens on (defaults to `3000`). | No       |
| `HTTPS` | HTTP/HTTPS Switch                                       | No       |

### Environment variable in different environments

There are two ways we use environment variables in the application:

1.  Build time environment variables. These are values that are known at build
    time and cannot be changed once the docker image is built. Currently this
    is only `NODE_ENV`. This is referenced in the code as `process.env.{key}`.

2.  Runtime configurable variables. These are values that can change for each place we run the app for example in staging we want the API url to be different to production. In the code these values are read using the config object for example `config.{key}`.

- Dev - Values are read from the environment.
- Docker - Values are read from `window.config` (as defined in `index.html`) and then `process.env`. `index.html` is rewritten in docker to read the available environment variables and pass them to the application every time the docker image starts.

### Authentication

See [docs on authentication](../docs/AUTHENTICATION.md) on setting up a Firebase account. The following environment variables are required for Firebase:

| Name                            | Description              | Required |
| ------------------------------- | ------------------------ | -------- |
| `REACT_APP_FIREBASE_PROJECT_ID` | Your firebase project id | Yes      |
| `REACT_APP_FIREBASE_API_KEY`    | Your firebase API key    | Yes      |

They can be added to an `.env.development.local` and `.env.test` files in the eq-author folder:

Or you can run:

```bash
REACT_APP_FIREBASE_PROJECT_ID=ABC REACT_APP_FIREBASE_API_KEY=DEF yarn start
```

### Functional

The following environment variables should be placed in a `.env` file in the eq-author folder.

| Name                       | Description                             | Required |
| -------------------------- | --------------------------------------- | -------- |
| `REACT_APP_API_URL`        | Set Author API URL                      | Yes      |
| `REACT_APP_LAUNCH_URL`     | Set the launch-a-survey target          | No       |
| `REACT_APP_EXTRACTION_URL` | Set the extraction tool target url      | No       |
| `PUBLIC_URL`               | The public URL inferred if not provided | No       |

### Build configuration

| Name                          | Description                                                                    | Required |
| ----------------------------- | ------------------------------------------------------------------------------ | -------- |
| `BABEL_ENV`                   | Sets the environment the code is running in                                    | Yes      |
| `NODE_ENV`                    | Sets the environment the code is running in                                    | Yes      |
| `NODE_PATH`                   | Folder path for the code folder structure                                      | Yes      |
| `CI`                          | Switch that if is set to true will treat warnings as errors                    | No       |
| `REACT_APP_EQ_AUTHOR_VERSION` | The current Author version. This is what gets reported on the /status endpoint | No       |

### Third party services

| Name                      | Description                                     | Required |
|---------------------------|-------------------------------------------------|----------|
| `REACT_APP_SENTRY_DSN`    | Use Sentry for error checking, by providing dsn | No       |
| `REACT_APP_SENTRY_ENV`    | Use Sentry to sort errors by environment        | No       |
| `REACT_APP_FULLSTORY_ORG` | Use fullstory, by providing org id              | No       |
| `REACT_APP_GTM_ID`        | Google tag manager Id                           | No       |
| `REACT_APP_GTM_AUTH`      | Google tag manager environment Id               | No       |
| `REACT_APP_GTM_PREVIEW`   | Google tag manager preview Id                   | No       |

## Folder Structure

`/config` Webpack config.

`/public` Public static assets.

`/scripts` NPM scripts for running the app.

`/src` JavaScript source files.

`/src/components` React components.

`/src/constants` Constants that can be used throughout the application such as
theme colours and action names.

## Storybook

`yarn` Install dependancies.

`yarn storybook` Start the local server.

`yarn build-storybook -o ../docs` deploy updates to static site (run from eq-author folder).
