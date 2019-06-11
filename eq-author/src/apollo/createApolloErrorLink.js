import { onError } from "apollo-link-error";
import { apiDownError } from "redux/saving/actions";
import { signOutUser } from "../redux/auth/actions";

export const errorHandler = (getStore, { networkError }) => {
  if (networkError && networkError.bodyText === "User does not exist") {
    getStore().dispatch(signOutUser());
  } else if (networkError) {
    getStore().dispatch(apiDownError());
  }
};

export default getStore => onError(errors => errorHandler(getStore, errors));
