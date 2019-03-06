# Authentication

![firebase_28dp.png](/docs/firebase_28dp.png) We currently use Firebase  for basic authentication requirements.  

- Go to [Firebase](https://firebase.google.com)
- Add a project
- Open Develop/Authentication from sidebar
- Set up sign-in method
- Enable signing in by email only
- Add user
- Select settings by Project Overview
- Copy down Project ID AND API Key

The following environment variables are required for firebase:

- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_API_KEY`

They should be added to an `.env.development.local` file in the eq-author sub folder:

Note: CLI env vars taken precedence over `.env.development.local` vars. For more information about precedence of config files, see: <https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use>
