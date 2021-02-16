import * as Sentry from "@sentry/browser";
import jwt from "jsonwebtoken";

export const setSentryUser = (token) => {
  if (token) {
    const decodedToken = jwt.decode(token);
    Sentry.setUser({
      email: decodedToken.email,
      username: decodedToken.user_id,
    });
  } else {
    Sentry.setUser({
      email: "missing@token.com",
      username: "unknown-user-missing-token",
    });
  }
};

export const setSentryTag = (errorType) => {
  Sentry.setTag("error_type", errorType);
};

export const sendSentryError = (error) => {
  Sentry.captureException(error);
};

export default { sendSentryError, setSentryTag, setSentryUser };
