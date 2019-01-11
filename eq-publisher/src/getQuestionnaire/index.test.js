const getQuestionnaire = require("./");

describe("getQuestionnaire", () => {
  let apolloFetch, createApolloFetch;
  beforeEach(() => {
    apolloFetch = jest.fn();
    apolloFetch.use = jest.fn();

    createApolloFetch = jest.fn().mockReturnValue(apolloFetch);
  });

  it("should initialise apollo fetch with the uri", () => {
    getQuestionnaire("test url", createApolloFetch)(
      "questionnaire id",
      "token"
    );
    expect(createApolloFetch).toHaveBeenCalledWith({ uri: "test url" });
  });

  it("should set apollo fetch middleware to set the auth token and questionnaire id", () => {
    getQuestionnaire("test url", createApolloFetch)(
      "questionnaire id",
      "token"
    );
    const next = jest.fn();
    const options = {};
    // use is called with a function so grab the first argument of the first call and call it
    apolloFetch.use.mock.calls[0][0]({ options }, next);
    expect(options.headers).toMatchObject({
      authorization: "Bearer token",
      questionnaireId: "questionnaire id",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should make the call to the api to get the questionnaire", () => {
    getQuestionnaire("test url", createApolloFetch)(1, "token");
    expect(apolloFetch).toHaveBeenCalledWith({
      query: expect.any(String),
      variables: { input: { questionnaireId: "1" } },
    });
  });
});
