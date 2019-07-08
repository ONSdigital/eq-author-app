import appendAuthHeader from "./authHeader";
import jwt from "jsonwebtoken";
import { SynchronousPromise } from "synchronous-promise";

describe("appendAuthHeader", () => {
  let otherHeaders, originalFetch;

  beforeEach(() => {
    otherHeaders = {
      ContentType: "text/html",
    };
    originalFetch = window.fetch;
    window.fetch = jest.fn(() =>
      SynchronousPromise.resolve({
        //eslint-disable-next-line
        json: jest.fn(() => ({ access_token: "I'm a access token, honest!" })),
      })
    );

    localStorage.removeItem("accessToken");
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  it("should append auth header if token exists and has not expired", async () => {
    const token = jwt.sign(
      {
        test: "I'm a jwt from the future",
        exp: Math.floor(Date.now() / 1000) + 300,
      },
      "shhhhh"
    );
    localStorage.setItem("accessToken", token);

    await expect(appendAuthHeader(otherHeaders)).resolves.toMatchObject({
      ContentType: "text/html",
      authorization: `Bearer ${token}`,
    });
  });

  it("try to fetch a new token if current access token has expired", async () => {
    const token = jwt.sign(
      {
        test: "I'm a jwt from the past",
        exp: Math.floor(Date.now() / 1000) - 300,
      },
      "shhhhh"
    );
    localStorage.setItem("accessToken", token);

    await expect(appendAuthHeader(otherHeaders)).resolves.toMatchObject({
      ContentType: "text/html",
      authorization: "Bearer I'm a access token, honest!",
    });
  });
});
