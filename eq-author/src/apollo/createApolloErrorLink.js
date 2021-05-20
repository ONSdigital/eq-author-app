import {
  setSentryUser,
  setSentryTag,
  sendSentryError,
} from "../apollo/sentryUtils";
import { onError } from "apollo-link-error";

import auth from "components/Auth";

import { NetworkActivityContextRef } from "components/NetworkActivityContext";

export const errorHandler = (error) => {
  const { networkError, graphQLErrors } = error;
  setSentryUser(window.localStorage.getItem("accessToken"));

  if (networkError) {
    const httpStatusCode = networkError.statusCode;
    setSentryTag("networkError");
    sendSentryError(networkError);

    switch (httpStatusCode) {
      // 401 - User does not exist
      case 401:
        auth.signOut();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        break;
      // 403 - Unauthorized questionnaire access
      case 403:
        break;
      default:
        NetworkActivityContextRef.current?.setApiErrorOccurred?.(true);
    }
  }
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      setSentryTag("graphQLError");
      sendSentryError(error);
    });
  }
};

export default () => onError((errors) => errorHandler(errors));
