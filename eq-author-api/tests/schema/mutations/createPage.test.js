const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("createPage", () => {
  const createPage = `
    mutation CreatePage($input: CreatePageInput!) {
      createPage(input: $input) {
        id,
        title,
        description,
        ... on QuestionPage {
          guidance
        }
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      Page: mockRepository()
    };
  });

  it("should allow creation of Page", async () => {
    const input = {
      title: "Test page",
      description: "Test page description",
      sectionId: "1"
    };

    const result = await executeQuery(createPage, { input }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.Page.insert).toHaveBeenCalledWith(input);
  });
});
