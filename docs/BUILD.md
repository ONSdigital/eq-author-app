# Build

## Front End  

### Build configuration

| Name                          | Description                                                                    | Required |
| ----------------------------- | ------------------------------------------------------------------------------ | -------- |
| `BABEL_ENV`                   | Sets the environment the code is running in                                    | Yes      |
| `NODE_ENV`                    | Sets the environment the code is running in                                    | Yes      |
| `NODE_PATH`                   | Folder path for the code folder structure                                      | Yes      |
| `CI`                          | Switch that if is set to true will treat warnings as errors                    | No       |
| `REACT_APP_EQ_AUTHOR_VERSION` | The current Author version. This is what gets reported on the /status endpoint | No       |

### `yarn build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
The build will produce the static assets for the front end.
