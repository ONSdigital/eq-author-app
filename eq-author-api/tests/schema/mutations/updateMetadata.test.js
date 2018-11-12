const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("updateMetadata", () => {
  const updateMetadata = `
    mutation UpdateMetadata($input: UpdateMetadataInput!) {
      updateMetadata(input: $input) {
        id
      }
    }
  `;

  const METADATA_ID = "100";
  const basicInput = {
    id: METADATA_ID,
    key: "ru_ref",
    alias: "Reporting Unit Reference"
  };

  let repositories;

  beforeEach(() => {
    repositories = {
      Metadata: mockRepository({
        update: {
          id: METADATA_ID
        }
      })
    };
  });

  it("should allow update of Metadata for textValue", async () => {
    const input = {
      ...basicInput,
      type: "Text",
      textValue: "test value"
    };

    const expected = {
      ...basicInput,
      type: "Text",
      textValue: "test value"
    };

    const result = await executeQuery(
      updateMetadata,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Metadata.update).toHaveBeenCalledWith(expected);
    expect(result.data.updateMetadata.id).toBe(METADATA_ID);
  });

  it("should allow update of Metadata for regionValue", async () => {
    const input = {
      ...basicInput,
      type: "Region",
      regionValue: "GB_ENG"
    };

    const expected = {
      ...basicInput,
      type: "Region",
      regionValue: "GB_ENG"
    };

    const result = await executeQuery(
      updateMetadata,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Metadata.update).toHaveBeenCalledWith(expected);
    expect(result.data.updateMetadata.id).toBe(METADATA_ID);
  });

  it("should allow update of Metadata for languageValue", async () => {
    const input = {
      ...basicInput,
      type: "Language",
      languageValue: "cy"
    };

    const expected = {
      ...basicInput,
      type: "Language",
      languageValue: "cy"
    };

    const result = await executeQuery(
      updateMetadata,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Metadata.update).toHaveBeenCalledWith(expected);
    expect(result.data.updateMetadata.id).toBe(METADATA_ID);
  });

  it("should allow update of Metadata for dateValue", async () => {
    const input = {
      ...basicInput,
      type: "Date",
      dateValue: "2007-12-03"
    };

    const expected = {
      ...basicInput,
      type: "Date",
      dateValue: new Date("2007-12-03")
    };

    const result = await executeQuery(
      updateMetadata,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Metadata.update).toHaveBeenCalledWith(expected);
    expect(result.data.updateMetadata.id).toBe(METADATA_ID);
  });
});
