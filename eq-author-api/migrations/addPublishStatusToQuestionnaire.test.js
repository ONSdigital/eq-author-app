const { cloneDeep } = require("lodash");
const addPublishStatusToQuestionnaire = require("./addPublishStatusToQuestionnaire.js");
const UNPUBLISHED = "Unpublished";
const PUBLISHED = "Published";

describe("addPublishStatusToQuestionnaire", () => {
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
    expect(addPublishStatusToQuestionnaire(cloneDeep(questionnaire))).toEqual(
      addPublishStatusToQuestionnaire(cloneDeep(questionnaire))
    );
  });

  it("should add publishStatus if it is missing", () => {
    expect(addPublishStatusToQuestionnaire(questionnaire)).toEqual({
      ...questionnaire,
      publishStatus: UNPUBLISHED,
    });
  });
  it("should not change existing Publish states", () => {
    const newQuestionnaire = { ...questionnaire, publishStatus: PUBLISHED };
    expect(addPublishStatusToQuestionnaire(newQuestionnaire)).toEqual({
      ...newQuestionnaire,
      publishStatus: PUBLISHED,
    });
  });
});
