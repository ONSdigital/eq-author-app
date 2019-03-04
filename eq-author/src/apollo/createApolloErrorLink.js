import { onError } from "apollo-link-error";
import { apiDownError } from "redux/saving/actions";

export default getStore =>
  onError(({ networkError, graphQLErrors }) => {
    if (networkError || graphQLErrors) {
      getStore().dispatch(apiDownError());
      const error =
        networkError || graphQLErrors.map(e => e.message).join("\n");
      throw new Error(`Graphql Error detected: ${error}`);
    }
  });
