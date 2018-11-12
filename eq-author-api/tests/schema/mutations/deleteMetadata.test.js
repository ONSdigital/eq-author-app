const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("deleteMetadata", () => {
  const deleteMetadata = `
    mutation DeleteMetadata($input: DeleteMetadataInput!) {
      deleteMetadata(input: $input) {
        id
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      Metadata: mockRepository({
        remove: { id: "1" }
      })
    };
  });

  it("should allow deletion of Metadata", async () => {
    const input = { id: "1" };
    const result = await executeQuery(
      deleteMetadata,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Metadata.remove).toHaveBeenCalledWith(input.id);
  });
});
