const deleteMetadata = require("./deleteMetadata");

describe("Translating deleted metadata in a title", () => {
  let mockPage, mockAlias, mockMetadataId;

  beforeEach(() => {
    mockAlias = "Cloud 9";
    mockPage = {
      title: `The business name is <span data-metadataId="${mockMetadataId}">${mockAlias}</span>`,
      description: `Hello <span data-metadataId="${mockMetadataId}">${mockAlias}</span> employee, how are you today?`,
    };
  });

  it("Changes the text with 'deleted metadata'", () => {
    const translatedPage = deleteMetadata(
      { id: mockMetadataId, alias: mockAlias },
      [mockPage]
    );

    expect(translatedPage[0].title).toBe(
      `The business name is <span data-metadataId="${mockMetadataId}">Deleted metadata</span>`
    );

    expect(translatedPage[0].description).toBe(
      `Hello <span data-metadataId="${mockMetadataId}">Deleted metadata</span> employee, how are you today?`
    );
  });

  it("Does not change if it doesn't need to", () => {
    const translatedPage = deleteMetadata(
      { id: "fake-metadata", alias: "Target" },
      [mockPage]
    );

    expect(translatedPage[0].title).toBe(
      `The business name is <span data-metadataId="${mockMetadataId}">${mockAlias}</span>`
    );

    expect(translatedPage[0].description).toBe(
      `Hello <span data-metadataId="${mockMetadataId}">${mockAlias}</span> employee, how are you today?`
    );
  });
});
