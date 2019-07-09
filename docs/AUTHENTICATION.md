# Authentication

![firebase_28dp.png](firebase_28dp.png) We currently use Firebase for basic authentication requirements.

- Go to [Firebase](https://firebase.google.com)
- Add a project
- Open Develop/Authentication from sidebar
- Set up sign-in method
- Enable signing in by email only
- Add user
- Select settings by Project Overview
- Copy down Project ID AND API Key

## eq-author

The following environment variables are required for firebase:

| Name                            | Description                                                                          | Required |
| ------------------------------- | ------------------------------------------------------------------------------------ | -------- |
| `REACT_APP_FIREBASE_PROJECT_ID` | The project ID for your Firebase project. Can be obtained from your Firebase project |          |
| `REACT_APP_FIREBASE_API_KEY`    | The api key for your Firebase project. Can be obtained from your Firebase project    | Yes      |

They should be added to an `.env.development.local` file in the eq-author sub folder:

```
REACT_APP_FIREBASE_PROJECT_ID="ABC"
REACT_APP_FIREBASE_API_KEY="DEF"
```

These can also be passed on command line:

```bash
REACT_APP_FIREBASE_PROJECT_ID=ABC REACT_APP_FIREBASE_API_KEY=DEF yarn start
```

Note: CLI env vars taken precedence over `.env.development.local` vars. For more information about precedence of config files, see: <https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use>

## eq-author-api

The following environment variables are required for firebase:

| Name                  | Description                                                                          | Required |
| --------------------- | ------------------------------------------------------------------------------------ | -------- |
| `FIREBASE_PROJECT_ID` | The project ID for your Firebase project. Can be obtained from your Firebase project | Yes      |

They should be added to an `.env` file in the eq-author-api sub folder:

```
FIREBASE_PROJECT_ID="YOUR_FIREBASE_APP_ID"
```
