const { cloneDeep } = require("lodash");
const addIsPublicFlag = require("./addIsPublicFlag.js");

describe("addIsPublicFlag", () => {
  let questionnaire = {};
  beforeEach(() => {
    questionnaire = {
      id: "aca64645-98ef-43ae-8b77-d749b4e89a05",
      title: "laa",
      description: null,
      type: "Social",
      theme: "default",
      introduction: null,
      navigation: false,
      surveyId: null,
      summary: false,
      metadata: [],
      sections: [],
    };
  });
  // This test must remain for your migration to always work
  it("should be deterministic", () => {
    expect(addIsPublicFlag(cloneDeep(questionnaire))).toEqual(
      addIsPublicFlag(cloneDeep(questionnaire))
    );
  });

  it("should add isPublic if it is missing", () => {
    expect(addIsPublicFlag(questionnaire)).toEqual({
      ...questionnaire,
      isPublic: true,
    });
  });
  it("should not set isPublic to true if it already is false", () => {
    const newQuestionnaire = { ...questionnaire, isPublic: false };
    expect(addIsPublicFlag(newQuestionnaire)).toEqual({
      ...newQuestionnaire,
      isPublic: false,
    });
  });
});
