window.config = window.config || {};
const config = {
  REACT_APP_API_URL:
    window.config.REACT_APP_API_URL || process.env.REACT_APP_API_URL,
  REACT_APP_SIGN_IN_URL:
    window.config.REACT_APP_SIGN_IN_URL ||
    process.env.REACT_APP_SIGN_IN_URL ||
    "/signIn",
  REACT_APP_SENTRY_ENV:
    window.config.REACT_APP_SENTRY_ENV || process.env.REACT_APP_SENTRY_ENV,
  REACT_APP_FIREBASE_API_KEY:
    window.config.REACT_APP_FIREBASE_API_KEY ||
    process.env.REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_PROJECT_ID:
    window.config.REACT_APP_FIREBASE_PROJECT_ID ||
    process.env.REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_LAUNCH_URL:
    window.config.REACT_APP_LAUNCH_URL || process.env.REACT_APP_LAUNCH_URL,
  REACT_APP_FULLSTORY_ORG:
    window.config.REACT_APP_FULLSTORY_ORG ||
    process.env.REACT_APP_FULLSTORY_ORG,
  REACT_APP_SENTRY_DSN:
    window.config.REACT_APP_SENTRY_DSN || process.env.REACT_APP_SENTRY_DSN,
  REACT_APP_HOT_JAR_ID:
    window.config.REACT_APP_HOT_JAR_ID || process.env.REACT_APP_HOT_JAR_ID,
  REACT_APP_GTM_ID:
    window.config.REACT_APP_GTM_ID || process.env.REACT_APP_GTM_ID,
  REACT_APP_GTM_AUTH:
    window.config.REACT_APP_GTM_AUTH || process.env.REACT_APP_GTM_AUTH,
  REACT_APP_GTM_PREVIEW:
    window.config.REACT_APP_GTM_PREVIEW || process.env.REACT_APP_GTM_PREVIEW,
  REACT_APP_VALID_EMAIL_DOMAINS:
    window.config.REACT_APP_VALID_EMAIL_DOMAINS ||
    process.env.REACT_APP_VALID_EMAIL_DOMAINS,
  REACT_APP_ORGANISATION_ABBR:
    window.config.REACT_APP_ORGANISATION_ABBR ||
    process.env.REACT_APP_ORGANISATION_ABBR,
  REACT_APP_FEATURE_FLAGS:
    window.config.REACT_APP_FEATURE_FLAGS ||
    process.env.REACT_APP_FEATURE_FLAGS ||
    "",
};

export default config;
