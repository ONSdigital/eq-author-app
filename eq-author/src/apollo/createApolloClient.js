import { ApolloClient } from "apollo-client";
import { resolvers, typeDefs } from "./resolvers";

export default (link, cache) => {
  const client = new ApolloClient({
    link,
    cache,
    typeDefs,
    resolvers,
    connectToDevTools: process.env.NODE_ENV === "development",
  });

  const data = {
    newPagesList: [],
    pagesVisitedList: [],
  };

  cache.writeData({ data });
  client.onResetStore(() => cache.writeData({ data }));

  return client;
};
