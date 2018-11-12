const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("deleteSection", () => {
  const deleteSection = `
    mutation DeleteSection($input:DeleteSectionInput!) {
      deleteSection(input:$input) {
        id
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      Section: mockRepository()
    };
  });

  it("should allow deletion of Section", async () => {
    const input = { id: "1" };
    const result = await executeQuery(
      deleteSection,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Section.remove).toHaveBeenCalledWith(input.id);
  });
});
