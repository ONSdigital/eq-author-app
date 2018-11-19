const executeQuery = require("../../utils/executeQuery");

const MUTATION = `
mutation UpdateQuestionConfirmation($input: UpdateQuestionConfirmationInput!) {
  updateQuestionConfirmation(input: $input) {
    id
    title
    positive {
      label
      description
    }
    negative {
      label
      description
    }
  }
}
`;

describe("updateQuestionConfirmation", () => {
  let repositories;
  beforeEach(() => {
    repositories = {
      QuestionConfirmation: {
        update: jest.fn().mockResolvedValue({
          id: "1",
          title: "My new title",
          positiveLabel: "pl",
          positiveDescription: "pd",
          negativeLabel: "nl",
          negativeDescription: "nd",
          pageId: "2"
        })
      }
    };
  });

  it("should update the question confirmation", async () => {
    const input = {
      id: "1",
      title: "My new title",
      positive: { label: "pl", description: "pd" },
      negative: { label: "nl", description: "nd" }
    };

    const result = await executeQuery(MUTATION, { input }, { repositories });
    expect(result.errors).toBeUndefined();

    expect(repositories.QuestionConfirmation.update).toHaveBeenCalledWith({
      id: "1",
      title: "My new title",
      positiveLabel: "pl",
      positiveDescription: "pd",
      negativeLabel: "nl",
      negativeDescription: "nd"
    });

    expect(result.data).toMatchObject({
      updateQuestionConfirmation: {
        id: "1",
        title: "My new title",
        positive: {
          label: "pl",
          description: "pd"
        },
        negative: {
          label: "nl",
          description: "nd"
        }
      }
    });
  });
});
