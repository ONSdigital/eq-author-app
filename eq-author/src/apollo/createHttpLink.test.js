import { HttpLink } from "apollo-link-http";
import createHttpLink from "./createHttpLink";

jest.mock("apollo-link-http");

describe("createHttpLink", () => {
  const uri = jest.fn();

  it("should return an instance of HttpLink", () => {
    expect(createHttpLink(uri)).toBeInstanceOf(HttpLink);
  });

  it("should pass uri to HttpLink constructor", () => {
    expect(HttpLink).toHaveBeenCalledWith({
      uri
    });
  });
});
