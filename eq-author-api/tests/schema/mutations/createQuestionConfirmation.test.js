const executeQuery = require("../../utils/executeQuery");

const MUTATION = `
mutation CreateQuestionConfirmation($input: CreateQuestionConfirmationInput!) {
  createQuestionConfirmation(input: $input) {
    id
    page {
      id
    }
  }
}
`;

describe("createQuestionConfirmation", () => {
  let repositories;
  beforeEach(() => {
    repositories = {
      QuestionConfirmation: {
        create: jest.fn().mockResolvedValue({
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

  it("should create the question confirmation", async () => {
    const input = { pageId: "2" };
    const result = await executeQuery(MUTATION, { input }, { repositories });
    expect(repositories.QuestionConfirmation.create).toHaveBeenCalledWith({
      pageId: "2"
    });
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      createQuestionConfirmation: {
        id: "1",
        page: {
          id: "2"
        }
      }
    });
  });
});
