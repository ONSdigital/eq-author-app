const addDrivingAndRepeatingIds = require("./addDrivingAndRepeatingIds.js");

describe("addDrivingAndRepeatingIds", () => {
  let questionnaire;

  beforeEach(() => {
    questionnaire = {
      id: "questionnaire1",
      sections: [
        {
          id: "section1",
          folders: [
            {
              id: "folder1",
              pages: [
                {
                  id: "questionPage1",
                  pageType: "QuestionPage",
                  answers: [
                    {
                      id: "answer1",
                      label: "Answer 1",
                      type: "Number",
                    },
                  ],
                },
                {
                  id: "listPage1",
                  pageType: "ListCollectorPage",
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should add driving and repeating (another) ID to list collector page if not defined", () => {
    const updatedQuestionnaire = addDrivingAndRepeatingIds(questionnaire);
    const updatedListCollectorPage =
      updatedQuestionnaire.sections[0].folders[0].pages[1];

    expect(updatedListCollectorPage.drivingId).toEqual(expect.any(String));
    expect(updatedListCollectorPage.anotherId).toEqual(expect.any(String));
  });

  it("should not add driving or repeating (another) ID to question page", () => {
    const updatedQuestionnaire = addDrivingAndRepeatingIds(questionnaire);
    const updatedQuestionPage =
      updatedQuestionnaire.sections[0].folders[0].pages[0];

    expect(updatedQuestionPage.drivingId).toBeUndefined();
    expect(updatedQuestionPage.anotherId).toBeUndefined();
  });

  it("should not change driving ID if it is already defined", () => {
    const drivingId = "test-driving-id";
    questionnaire.sections[0].folders[0].pages[1].drivingId = drivingId;

    const updatedQuestionnaire = addDrivingAndRepeatingIds(questionnaire);
    const updatedListCollectorPage =
      updatedQuestionnaire.sections[0].folders[0].pages[1];

    expect(updatedListCollectorPage.drivingId).toEqual("test-driving-id");
  });

  it("should not change repeating (another) ID if it is already defined", () => {
    const anotherId = "test-another-id";
    questionnaire.sections[0].folders[0].pages[1].anotherId = anotherId;

    const updatedQuestionnaire = addDrivingAndRepeatingIds(questionnaire);
    const updatedListCollectorPage =
      updatedQuestionnaire.sections[0].folders[0].pages[1];

    expect(updatedListCollectorPage.anotherId).toEqual("test-another-id");
  });
});
