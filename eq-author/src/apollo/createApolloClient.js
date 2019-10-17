import { ApolloClient } from "apollo-client";

export default (link, cache) => {
  return new ApolloClient({
    link,
    cache,
    connectToDevTools: true,
  });
};
