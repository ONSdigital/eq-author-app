const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("createQuestionPage", () => {
  const createQuestionPage = `
    mutation CreateQuestionPage($input: CreateQuestionPageInput!) {
      createQuestionPage(input: $input) {
        id
        title
        alias
        description
        guidance
        definitionLabel
        definitionContent
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      Page: mockRepository()
    };
  });

  it("should allow creation of Question", async () => {
    const input = {
      title: "Test question",
      alias: "Test alias",
      description: "Test question description",
      guidance: "Test question guidance",
      sectionId: "1",
      definitionLabel: "Test question definition label",
      definitionContent: "Test question definition content"
    };

    const result = await executeQuery(
      createQuestionPage,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Page.insert).toHaveBeenCalledWith({
      ...input,
      pageType: "QuestionPage"
    });
  });
});
