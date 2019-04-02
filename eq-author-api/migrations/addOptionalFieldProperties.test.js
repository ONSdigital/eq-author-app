const { get } = require("lodash");
const addOptionalFieldProperties = require("./addOptionalFieldProperties");

describe("addOptionalFieldProperties", () => {
  let questionnaire, page, firstPagePath;
  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          pages: [{}],
        },
      ],
    };
    firstPagePath = "sections[0].pages[0]";
    page = get(questionnaire, firstPagePath);
  });

  it("should enable optional field when description has content", () => {
    page.description = "foo";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).descriptionEnabled).toEqual(true);
  });

  it("should not enable optional field when description has no content", () => {
    page.description = "";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).descriptionEnabled).toEqual(false);
  });

  it("should enable optional field when guidance has content", () => {
    page.guidance = "foo";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).guidanceEnabled).toEqual(true);
  });

  it("should not enable optional field when guidance has no content", () => {
    page.guidance = "";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).guidanceEnabled).toEqual(false);
  });

  it("should enable optional field when definition label has content", () => {
    page.definitionLabel = "foo";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).definitionEnabled).toEqual(true);
  });

  it("should enable optional field when definition content has content", () => {
    page.definitionContent = "bar";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).definitionEnabled).toEqual(true);
  });

  it("should not enable optional field when definition has no content", () => {
    page.definitionLabel = "";
    page.definitionContent = "";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).definitionEnabled).toEqual(false);
  });

  it("should enable optional field when additionalInfo label has content", () => {
    page.additionalInfoLabel = "foo";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).additionalInfoEnabled).toEqual(true);
  });

  it("should enable optional field when additionalInfo content has content", () => {
    page.additionalInfoContent = "bar";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).additionalInfoEnabled).toEqual(true);
  });

  it("should not enable optional field when additionalInfo has no content", () => {
    page.additionalInfoLabel = "";
    page.additionalInfoContent = "";
    const result = addOptionalFieldProperties(questionnaire);
    expect(get(result, firstPagePath).additionalInfoEnabled).toEqual(false);
  });
});
