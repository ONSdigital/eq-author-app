const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("deleteQuestionPage", () => {
  const deleteQuestionPage = `
    mutation DeleteQuestionPage($input:DeleteQuestionPageInput!) {
      deleteQuestionPage(input:$input){
        id
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      QuestionPage: mockRepository()
    };
  });

  it("should allow deletion of Question", async () => {
    const input = { id: "1" };
    const result = await executeQuery(
      deleteQuestionPage,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.QuestionPage.remove).toHaveBeenCalledWith(input.id);
  });
});
