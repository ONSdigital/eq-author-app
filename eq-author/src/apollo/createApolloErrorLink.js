import { onError } from "apollo-link-error";
import { apiDownError } from "../redux/saving/actions";

export default getStore =>
  onError(({ networkError }) => {
    if (networkError) {
      getStore().dispatch(apiDownError());
    }
  });
