const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

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

  let repositories;

  beforeEach(() => {
    repositories = {
      Answer: mockRepository({
        insert: {
          id: "1",
          type: "TextField",
          page: {
            id: "1"
          }
        }
      })
    };
  });

  it("should call createAnswer on create mutation", async () => {
    const input = {
      description: "Test answer description",
      guidance: "Test answer guidance",
      type: "TextField",
      questionPageId: "1"
    };

    const result = await executeQuery(
      createAnswer,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Answer.createAnswer).toHaveBeenCalled();
  });
});
