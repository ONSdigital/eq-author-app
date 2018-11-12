const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("deletePage", () => {
  const deletePage = `
    mutation DeletePage($input:DeletePageInput!) {
      deletePage(input:$input) {
        id
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      Page: mockRepository()
    };
  });

  it("should allow deletion of Page", async () => {
    const input = { id: "1" };
    const result = await executeQuery(deletePage, { input }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.Page.remove).toHaveBeenCalledWith(input.id);
  });
});
