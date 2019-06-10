import { setSentryUser, setSentryTag, sendSentryError } from "./sentryUtils";
import * as Sentry from "@sentry/browser";
import uuid from "uuid";
import jwt from "jsonwebtoken";

jest.mock("@sentry/browser");

const createAccessToken = (token, signingKey = uuid.v4()) => {
  return jwt.sign(token, signingKey);
};

describe("sentry utils functions", () => {
  let networkError = {
    fail: "Uh oh",
  };
  let token;

  it("should call sentry with email and username", () => {
    /* eslint-disable-next-line camelcase */
    const tokenData = { user_id: "Test User", email: "test.user@email.com" };
    token = createAccessToken(tokenData);
    localStorage.setItem("accessToken", token);

    setSentryUser(token);
    expect(Sentry.setUser).toHaveBeenCalledWith({
      email: "test.user@email.com",
      username: "Test User",
    });
  });

  it("send the error to sentry", () => {
    sendSentryError(networkError);
    expect(Sentry.captureException).toHaveBeenCalledWith(networkError);
  });

  it("should set the error type tag", () => {
    setSentryTag(networkError);
    expect(Sentry.setTag).toHaveBeenCalledWith("error_type", networkError);
  });

  it("should deal with missing or invalid token", () => {
    localStorage.removeItem("accessToken");
    setSentryUser(null);

    expect(Sentry.setUser).toHaveBeenCalledWith({
      email: "missing@token.com",
      username: "unknown-user-missing-token",
    });
  });
});
