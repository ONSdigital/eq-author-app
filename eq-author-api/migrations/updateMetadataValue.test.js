const updateMetadataValue = require("./updateMetadataValue.js");

describe("updateMetadataValue", () => {
  it("should update metadata to correct new format", () => {
    const metadata = [
      {
        alias: "text",
        dateValue: null,
        id: "296",
        key: "ru_ref",
        languageValue: null,
        regionValue: null,
        textValue: "old Value",
        type: "Text",
        value: "new Value",
      },
      {
        alias: "date",
        dateValue: "2019-07-01",
        id: "294",
        key: "date",
        languageValue: null,
        regionValue: null,
        textValue: null,
        type: "Date",
        value: "2019-04-09",
      },
      {
        alias: "region",
        dateValue: null,
        id: "297",
        key: "region",
        languageValue: null,
        regionValue: "GB_GBN",
        textValue: null,
        type: "Region",
        value: "GB_ENG",
      },
      {
        alias: "language",
        dateValue: null,
        id: "297",
        key: "language",
        languageValue: "cy",
        regionValue: null,
        textValue: null,
        type: "Language",
        value: "en",
      },
      {
        alias: "language",
        dateValue: null,
        id: "297",
        key: "language",
        languageValue: "cy",
        regionValue: null,
        textValue: null,
        type: "Language",
      },
    ];
    const updatedQuestionnaire = updateMetadataValue({ metadata });
    updatedQuestionnaire.metadata.forEach((metadata) => {
      expect(metadata).not.toHaveProperty("value");
    });
    expect(updatedQuestionnaire.metadata[0].textValue).toEqual("new Value");
    expect(updatedQuestionnaire.metadata[1].dateValue).toEqual("2019-04-09");
    expect(updatedQuestionnaire.metadata[2].regionValue).toEqual("GB_ENG");
    expect(updatedQuestionnaire.metadata[3].languageValue).toEqual("en");
  });
  it("should not update if metadata is already in correct format", () => {
    const metadata = [
      {
        alias: "language",
        dateValue: null,
        id: "297",
        key: "language",
        languageValue: "cy",
        regionValue: null,
        textValue: null,
        type: "Language",
      },
    ];
    const updatedQuestionnaire = updateMetadataValue({ metadata });
    expect(updatedQuestionnaire.metadata[0]).toMatchObject(metadata[0]);
  });
});
