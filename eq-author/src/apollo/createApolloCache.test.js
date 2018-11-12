import createApolloCache from "./createApolloCache";
import { InMemoryCache } from "apollo-cache-inmemory";

describe("createApolloCache", () => {
  it("should return an instance of InMemoryCache", () => {
    expect(createApolloCache(jest.fn())).toBeInstanceOf(InMemoryCache);
  });
});
