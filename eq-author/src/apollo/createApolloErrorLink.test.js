import { errorHandler } from "./createApolloErrorLink";

const dispatch = jest.fn();

const createMockStore = () => ({
  dispatch,
});

describe("createErrorLink", () => {
  it("should dispatch a logout event when the server responds with a 401 error", () => {
    errorHandler(createMockStore, {
      networkError: {
        bodyText: "User does not exist",
      },
    });
    expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should dispatch a apiDownError when the server responds with a error", () => {
    errorHandler(createMockStore, {
      networkError: {
        fail: "Uh oh",
      },
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "API_DOWN_ERROR" });
  });
});
