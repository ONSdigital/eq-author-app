# Authentication

![Firebase logo](images/firebase_logo.png) We currently use Firebase for basic authentication requirements.

- Go to [Firebase](https://firebase.google.com)
- Add a project
- Open Develop/Authentication from sidebar
- Set up sign-in method
- Enable signing in by email only
- Add user
- Select settings by Project Overview
- Copy down Project ID AND API Key

Note: CLI env vars taken precedence over `.env.development.local` vars. For more information about precedence of config files, see: <https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use>

## eq-author

The following environment variables are required for eq-author:

```
REACT_APP_FIREBASE_PROJECT_ID="YOUR_FIREBASE_APP_ID"
REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"
```

They should be added to an `.env.development.local` file in the eq-author sub folder:

## eq-author-api

The following environment variables are required for eq-author-api:

```
FIREBASE_PROJECT_ID="YOUR_FIREBASE_APP_ID"
```

They should be added to an `.env` file in the eq-author-api sub folder:
