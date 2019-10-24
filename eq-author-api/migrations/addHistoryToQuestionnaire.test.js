const { cloneDeep } = require("lodash");
const addHistoryToQuestionnaire = require("./addHistoryToQuestionnaire.js");

describe("addHistoryToQuestionnaire", () => {
  // This test must remain for your migration to always work
  const questionnaire = {
    id: "603cb6a2-7570-4a6b-97b0-5882fd5cfd47",
    title: "Hello",
    description: null,
    type: "Social",
    theme: "default",
    introduction: null,
    navigation: false,
    surveyId: null,
    summary: false,
    createdBy: "7c0abf65-9c8f-491c-bcd5-76f53f3983a9",
    createdAt: 1571210310906,
    metadata: [],
    sections: [
      {
        id: "d973df57-f1f6-4679-9fdb-a4307053afb2",
        title: "",
        introductionTitle: null,
        introductionContent: null,
      },
    ],
  };
  it("should be deterministic", () => {
    expect(addHistoryToQuestionnaire(cloneDeep(questionnaire))).toEqual(
      addHistoryToQuestionnaire(cloneDeep(questionnaire))
    );
  });

  it("should add history if it is missing", () => {
    expect(addHistoryToQuestionnaire(questionnaire)).toEqual({
      ...questionnaire,
      history: [
        {
          id: "creationEvent",
          publishStatus: "Questionnaire created",
          questionnaireTitle: questionnaire.title,
          userId: questionnaire.createdBy,
          time: questionnaire.createdAt,
        },
      ],
    });
  });
  it("should not add history if already there", () => {
    const newQuestionnaire = {
      ...questionnaire,
      history: [
        {
          id: "123",
          publishStatus: "Questionnaire created",
          questionnaireTitle: questionnaire.title,
          userId: questionnaire.createdBy,
          time: questionnaire.createdAt,
        },
      ],
    };
    expect(addHistoryToQuestionnaire(newQuestionnaire)).toEqual({
      ...newQuestionnaire,
      history: [
        {
          id: "123",
          publishStatus: "Questionnaire created",
          questionnaireTitle: questionnaire.title,
          userId: questionnaire.createdBy,
          time: questionnaire.createdAt,
        },
      ],
    });
  });
});
