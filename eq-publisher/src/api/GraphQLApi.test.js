const { getQuestionnaire } = require("./queries");

const GraphQLApi = require("./GraphQLApi");

describe("GraphQL Api", () => {
  it("should accept a client", () => {
    const mockApolloFetch = jest.fn();
    expect(new GraphQLApi(mockApolloFetch).apolloFetch).toBe(mockApolloFetch);
  });

  describe("interaction with client", () => {
    let mockApolloFetch;
    let api;

    beforeEach(() => {
      mockApolloFetch = jest.fn();
      api = new GraphQLApi(mockApolloFetch);
    });

    it("should call apolloFetch with the getQuestionnaires query", () => {
      api.getAuthorData("1");

      expect(mockApolloFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          query: getQuestionnaire,
          variables: {
            questionnaireId: "1"
          }
        })
      );
    });
  });
});
