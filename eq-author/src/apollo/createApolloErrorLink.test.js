import uuid from "uuid";
import jwt from "jsonwebtoken";
import { errorHandler } from "./createApolloErrorLink";
import { sendSentryError, setSentryTag, setSentryUser } from "./sentryUtils";

jest.mock("./sentryUtils");

describe("createErrorLink", () => {
  let dispatch;
  let networkError;
  let graphQLErrors;

  const createAccessToken = (token, signingKey = uuid.v4()) => {
    return jwt.sign(token, signingKey);
  };

  const createMockStore = () => ({
    dispatch,
  });

  beforeAll(() => {
    dispatch = jest.fn();
  });

  beforeEach(() => {
    /* eslint-disable-next-line camelcase */
    const tokenData = { user_id: "Test User", email: "test.user@email.com" };
    const token = createAccessToken(tokenData);
    localStorage.setItem("accessToken", token);

    networkError = {
      fail: "Uh oh",
    };
    graphQLErrors = [
      {
        fail: "Uh oh",
      },
    ];
  });

  it("should dispatch a logout event when the server responds with a 401 error", () => {
    errorHandler(createMockStore, {
      networkError: { bodyText: "User does not exist" },
    });
    expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should dispatch a apiDownError when the server responds with a error", () => {
    errorHandler(createMockStore, {
      networkError,
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "API_DOWN_ERROR" });
  });

  it("should send network errors to sentry", () => {
    errorHandler(createMockStore, {
      networkError,
    });
    expect(sendSentryError).toHaveBeenCalledWith(networkError);
  });

  it("should send graphql errors to sentry", () => {
    errorHandler(createMockStore, {
      graphQLErrors,
    });
    expect(sendSentryError).toHaveBeenCalledWith(graphQLErrors[0]);
  });

  it("should tag errors with a type to be sent to sentry", () => {
    errorHandler(createMockStore, {
      graphQLErrors,
    });
    expect(setSentryTag).toHaveBeenCalledWith("graphQLError");
  });

  it("should set user information from the jwt token on error messages to send to sentry", () => {
    errorHandler(createMockStore, {
      graphQLErrors,
    });
    expect(setSentryUser).toHaveBeenCalledWith(
      localStorage.getItem("accessToken")
    );
  });
});
