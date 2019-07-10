# eq-author (Front End)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.  
Open <http://localhost:3000> to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.


## Environment Variables

### Third party services

| Name                      | Description                                     | Required |
| ------------------------- | ----------------------------------------------- | -------- |
| `REACT_APP_SENTRY_DSN`    | Use Sentry for error checking, by providing dsn | No       |
| `REACT_APP_SENTRY_ENV`    | Use Sentry to sort errors by environment        | No       |
| `REACT_APP_FULLSTORY_ORG` | Use fullstory, by providing org id              | No       |

### Runtime

| Name    | Description                                             | Required |
| ------- | ------------------------------------------------------- | -------- |
| `HOST`  | Set to 0.0.0.0 if not provided                          | No       |
| `PORT`  | The port which express listens on (defaults to `3000`). | No       |
| `HTTPS` | HTTP/HTTPS Switch                                       | No       |

### Environment variable in different environments

There are two ways we use environment variables in the application:

1.  Build time environment variables. These are values that are known at build time and cannot be changed once the docker image is built. Currently this is only `NODE_ENV`. This is referenced in the code as `process.env.{key}`.

2.  Runtime configurable variables. These are values that can change for each place we run the app for example in staging we want the API url to be different to production. In the code these values are read using the config object for example `config.{key}`.
    - Dev - Values are read from the environment.
    - Docker - Values are read from `window.config` (as defined in `index.html`) and then `process.env`. `index.html` is rewritten in docker to read the available environment variables and pass them to the application every time the docker image starts.
