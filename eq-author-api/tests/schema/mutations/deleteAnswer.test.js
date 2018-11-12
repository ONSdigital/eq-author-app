const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("deleteAnswer", () => {
  const deleteAnswer = `
    mutation DeleteAnswer($input:DeleteAnswerInput!) {
      deleteAnswer(input:$input){
        id
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      Answer: mockRepository()
    };
  });

  it("should allow deletion of Answer", async () => {
    const input = { id: "1" };
    const result = await executeQuery(
      deleteAnswer,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Answer.remove).toHaveBeenCalledWith(input.id);
  });
});
