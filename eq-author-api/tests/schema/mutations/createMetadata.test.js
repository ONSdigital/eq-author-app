const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");
const { createMetadataMutation } = require("../../utils/graphql");

describe("createMetadata", () => {
  const METADATA_ID = "100";
  const QUESTIONNAIRE_ID = "101";
  let repositories;

  beforeEach(() => {
    repositories = {
      Metadata: mockRepository({
        insert: { id: METADATA_ID, questionnaireId: QUESTIONNAIRE_ID }
      })
    };
  });

  it("should allow creation of Metadata", async () => {
    const input = {
      questionnaireId: QUESTIONNAIRE_ID
    };

    const result = await executeQuery(
      createMetadataMutation,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Metadata.insert).toHaveBeenCalledWith(input);
    expect(result.data.createMetadata.id).toBe(METADATA_ID);
  });
});
