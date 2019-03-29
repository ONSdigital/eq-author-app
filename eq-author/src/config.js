window.config = window.config || {};
const config = {
  REACT_APP_API_URL:
    window.config.REACT_APP_API_URL || process.env.REACT_APP_API_URL,
  REACT_APP_FIREBASE_API_KEY:
    window.config.REACT_APP_FIREBASE_API_KEY ||
    process.env.REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_PROJECT_ID:
    window.config.REACT_APP_FIREBASE_PROJECT_ID ||
    process.env.REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FUNCTIONAL_TEST:
    window.config.REACT_APP_FUNCTIONAL_TEST ||
    process.env.REACT_APP_FUNCTIONAL_TEST,
  REACT_APP_LAUNCH_URL:
    window.config.REACT_APP_LAUNCH_URL || process.env.REACT_APP_LAUNCH_URL,
  REACT_APP_FULLSTORY_ORG:
    window.config.REACT_APP_FULLSTORY_ORG ||
    process.env.REACT_APP_FULLSTORY_ORG,
  REACT_APP_SENTRY_DSN:
    window.config.REACT_APP_SENTRY_DSN || process.env.REACT_APP_SENTRY_DSN,
  REACT_APP_AUTH_TYPE:
    window.config.REACT_APP_AUTH_TYPE || process.env.REACT_APP_AUTH_TYPE,
  REACT_APP_HOT_JAR_ID:
    window.config.REACT_APP_HOT_JAR_ID || process.env.REACT_APP_HOT_JAR_ID,
  REACT_APP_GTM_ID:
    window.config.REACT_APP_GTM_ID || process.env.REACT_APP_GTM_ID,
  REACT_APP_GTM_ENV_ID:
    window.config.REACT_APP_GTM_ENV_ID || process.env.REACT_APP_GTM_ENV_ID,
};

export default config;
