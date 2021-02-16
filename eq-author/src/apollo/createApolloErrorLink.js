import {
  setSentryUser,
  setSentryTag,
  sendSentryError,
} from "../apollo/sentryUtils";
import { onError } from "apollo-link-error";
import { apiDownError } from "redux/saving/actions";

import auth from "components/Auth";

export const errorHandler = (getStore, error) => {
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
        getStore().dispatch(apiDownError());
    }
  }
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      setSentryTag("graphQLError");
      sendSentryError(error);
    });
  }
};

export default (getStore) =>
  onError((errors) => errorHandler(getStore, errors));
