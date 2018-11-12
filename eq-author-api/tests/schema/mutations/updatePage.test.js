const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("updatePage", () => {
  const updatePage = `
    mutation UpdatePage($input: UpdatePageInput!) {
      updatePage(input: $input) {
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

  it("should allow update of Page", async () => {
    const input = {
      id: "1",
      title: "Updated page title",
      description: "This is an updated page description"
    };

    const result = await executeQuery(updatePage, { input }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.Page.update).toHaveBeenCalledWith(input);
  });
});
