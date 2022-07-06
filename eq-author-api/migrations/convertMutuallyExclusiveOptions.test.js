const convertMutuallyExclusiveOptions = require("./convertMutuallyExclusiveOptions");

describe("convertMutuallyExclusiveOptions", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      id: "questionnaire-1",
      sections: [
        {
          id: "section-1",
          folders: [
            {
              id: "folder-1",
              pages: [
                {
                  id: "page-1",
                  answers: [
                    {
                      id: "answer-1",
                      type: "Number",
                      label: "How many pets do you have?",
                      options: [
                        {
                          id: "exclusive-1",
                          label: "No pets",
                          mutuallyExclusive: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should not convert mutually exclusive to mutually exclusive answer type when feature flag is not set", () => {
    const updatedQuestionnaire = convertMutuallyExclusiveOptions(questionnaire);
    const updatedQuestionnaireAnswers =
      updatedQuestionnaire.sections[0].folders[0].pages[0].answers;

    expect(updatedQuestionnaireAnswers.length).toBe(1);
    expect(updatedQuestionnaireAnswers[0].options.length).toBe(1);
    expect(updatedQuestionnaireAnswers[0].type).toBe("Number");
    expect(updatedQuestionnaireAnswers[0].options[0]).toMatchObject({
      id: "exclusive-1",
      label: "No pets",
      mutuallyExclusive: true,
    });
    expect(updatedQuestionnaireAnswers[1]).toBeUndefined();
  });

  it("should convert mutually exclusive to mutually exclusive answer type with correct data when feature flag is set", () => {
    process.env.FEATURE_FLAGS = "mutuallyExclusiveAnswer";

    const updatedQuestionnaire = convertMutuallyExclusiveOptions(questionnaire);
    const updatedQuestionnaireAnswers =
      updatedQuestionnaire.sections[0].folders[0].pages[0].answers;

    expect(updatedQuestionnaireAnswers.length).toBe(2);
    expect(updatedQuestionnaireAnswers[0].options).toBeUndefined();
    expect(updatedQuestionnaireAnswers[0].type).toBe("Number");
    expect(updatedQuestionnaireAnswers[1].type).toBe("MutuallyExclusive");
    expect(updatedQuestionnaireAnswers[1].questionPageId).toBe("page-1");
    expect(updatedQuestionnaireAnswers[1].options.length).toBe(1);
    expect(updatedQuestionnaireAnswers[1].options[0].label).toBe("No pets");
  });
});
