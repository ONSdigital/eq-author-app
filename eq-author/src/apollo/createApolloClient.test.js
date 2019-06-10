import createApolloClient from "./createApolloClient";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

describe("createClient", () => {
  let link, cache, client;

  beforeAll(() => {
    link = jest.fn();
    cache = new InMemoryCache();

    client = createApolloClient(link, cache);
  });

  it("should return an instance of ApolloClient", () => {
    expect(client).toBeInstanceOf(ApolloClient);
  });

  it("should set the cache", () => {
    expect(client.cache).toBe(cache);
  });
});
