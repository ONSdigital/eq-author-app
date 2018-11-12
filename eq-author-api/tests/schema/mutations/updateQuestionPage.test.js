const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("updateQuestionPage", () => {
  const updateQuestionPage = `
    mutation UpdateQuestionPage($input: UpdateQuestionPageInput!) {
      updateQuestionPage(input: $input) {
        id
        alias
        title
        description
        guidance
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      QuestionPage: mockRepository()
    };
  });

  it("should allow update of Question", async () => {
    const input = {
      id: "1",
      alias: "Updated question alias",
      title: "Updated question title",
      description: "This is an updated question description",
      guidance: "Updated question description"
    };

    const result = await executeQuery(
      updateQuestionPage,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.QuestionPage.update).toHaveBeenCalledWith(input);
  });
});
