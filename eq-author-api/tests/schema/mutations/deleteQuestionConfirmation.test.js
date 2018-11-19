const executeQuery = require("../../utils/executeQuery");

const MUTATION = `
mutation DeleteQuestionConfirmation($input: DeleteQuestionConfirmationInput!) {
  deleteQuestionConfirmation(input: $input) {
    id
    page {
      id
    }
  }
}
`;

describe("deleteQuestionConfirmation", () => {
  let repositories;
  beforeEach(() => {
    repositories = {
      QuestionConfirmation: {
        delete: jest.fn().mockResolvedValue({
          id: "1",
          pageId: "2"
        })
      },
      Page: {
        getById: jest.fn().mockResolvedValue({
          id: "2"
        })
      }
    };
  });

  it("should delete the question confirmation", async () => {
    const input = { id: "1" };
    const result = await executeQuery(MUTATION, { input }, { repositories });
    expect(repositories.QuestionConfirmation.delete).toHaveBeenCalledWith({
      id: "1"
    });
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      deleteQuestionConfirmation: {
        id: "1",
        page: {
          id: "2"
        }
      }
    });
  });
});
