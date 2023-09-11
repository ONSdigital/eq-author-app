const updateIntroductionPreviewQuestionsSettings = require("./updateIntroductionPreviewQuestionsSettings");

describe("updateIntroductionPreviewQuestionsSettings", () => {
  it("should check return questionnaire if introduction is undefined", () => {
    const questionnaire = {};
    expect(
      updateIntroductionPreviewQuestionsSettings(questionnaire)
    ).toBeTruthy();
  });

  it("should add preview questions equal to false if it doesnt exist", () => {
    const questionnaire = { introduction: {} };
    const updateIntroductionPreviewQuestion =
      updateIntroductionPreviewQuestionsSettings(questionnaire);

    expect(
      updateIntroductionPreviewQuestion.introduction.previewQuestions
    ).toBe(false);
  });

  it("should add disallow preview questions equal to false if it doesnt exist", () => {
    const questionnaire = { introduction: {} };
    const updateIntroductionPreviewQuestion =
      updateIntroductionPreviewQuestionsSettings(questionnaire);

    expect(
      updateIntroductionPreviewQuestion.introduction.disallowPreviewQuestions
    ).toBe(false);
  });

  it("should set previewQuestions to false and disallowPreviewQuestions to true if given a collection list is present", () => {
    const questionnaire = {
      introduction: {},
      collectionLists: {
        id: "collection-list-1",
        lists: [
          {
            id: "list-1",
            listName: "List 1",
            answers: [
              {
                id: "list-answer-1",
                type: "TextField",
                label: "List answer 1",
              },
            ],
          },
        ],
      },
    };
    const updateIntroductionPreviewQuestion =
      updateIntroductionPreviewQuestionsSettings(questionnaire);

    expect(
      updateIntroductionPreviewQuestion.introduction.previewQuestions
    ).toBe(false);
    expect(
      updateIntroductionPreviewQuestion.introduction.disallowPreviewQuestions
    ).toBe(true);
  });

  it("should check if preview questions is true, confirm it changes to false as it passes through migration", () => {
    const questionnaire = {
      introduction: { previewQuestions: true },
      collectionLists: {
        id: "collection-list-1",
        lists: [
          {
            id: "list-1",
            listName: "List 1",
            answers: [
              {
                id: "list-answer-1",
                type: "TextField",
                label: "List answer 1",
              },
            ],
          },
        ],
      },
    };
    const updateIntroductionPreviewQuestion =
      updateIntroductionPreviewQuestionsSettings(questionnaire);

    expect(
      updateIntroductionPreviewQuestion.introduction.previewQuestions
    ).toBe(false);
    expect(
      updateIntroductionPreviewQuestion.introduction.disallowPreviewQuestions
    ).toBe(true);
  });
});
