const executeQuery = require("../../utils/executeQuery");

describe("createAnswer", () => {
  const createAnswer = `
    mutation CreateAnswer($input: CreateAnswerInput!) {
      createAnswer(input: $input) {
        id,
        description,
        guidance,
        qCode,
        label,
        type,
        ... on MultipleChoiceAnswer {
          options {
            id
          }
        }
      }
    }
  `;

  it("should call createAnswer on create mutation", async () => {
    const repositories = {
      Answer: {
        createAnswer: jest.fn().mockResolvedValueOnce({
          id: "1",
          type: "TextField",
          page: {
            id: "1",
          },
        }),
      },
    };
    const modifiers = {
      BinaryExpression: {
        onAnswerCreated: jest.fn().mockResolvedValueOnce(),
      },
    };
    const input = {
      description: "Test answer description",
      guidance: "Test answer guidance",
      type: "TextField",
      questionPageId: "1",
    };

    const result = await executeQuery(
      createAnswer,
      { input },
      { repositories, modifiers }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Answer.createAnswer).toHaveBeenCalled();
    expect(modifiers.BinaryExpression.onAnswerCreated).toHaveBeenCalledWith({
      id: "1",
      type: "TextField",
      page: {
        id: "1",
      },
    });
  });
});
