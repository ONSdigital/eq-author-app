import {
  setSentryUser,
  setSentryTag,
  sendSentryError,
} from "../apollo/sentryUtils";
import { onError } from "apollo-link-error";
import { apiDownError } from "redux/saving/actions";
import { signOutUser } from "../redux/auth/actions";

export const errorHandler = (getStore, error) => {
  const { networkError, graphQLErrors } = error;
  setSentryUser(window.localStorage.getItem("accessToken"));
  if (networkError) {
    getStore().dispatch(apiDownError());
    setSentryTag("networkError");
    sendSentryError(networkError);
    if (networkError.bodyText === "User does not exist") {
      getStore().dispatch(signOutUser());
    }
    return;
  }
  graphQLErrors.forEach(error => {
    setSentryTag("graphQLError");
    sendSentryError(error);
  });
};

export default getStore => onError(errors => errorHandler(getStore, errors));
