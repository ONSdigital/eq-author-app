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

  it("should convert mutually exclusive to mutually exclusive answer type with correct data", () => {
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

  it("should not remove checkbox answer options", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0] = {
      id: "checkbox-1",
      type: "Checkbox",
      options: [
        { id: "option-1" },
        { id: "option-2" },
        {
          id: "exclusive-1",
          label: "Don't know",
          mutuallyExclusive: true,
        },
      ],
    };

    const questionnaireAnswers =
      questionnaire.sections[0].folders[0].pages[0].answers;
    expect(questionnaireAnswers).toHaveLength(1);
    expect(questionnaireAnswers[0].type).toBe("Checkbox");
    expect(questionnaireAnswers[0].options).toHaveLength(3);

    const updatedQuestionnaire = convertMutuallyExclusiveOptions(questionnaire);
    const updatedQuestionnaireAnswers =
      updatedQuestionnaire.sections[0].folders[0].pages[0].answers;

    expect(updatedQuestionnaireAnswers).toHaveLength(2);
    expect(updatedQuestionnaireAnswers[0].type).toBe("Checkbox");
    expect(updatedQuestionnaireAnswers[1].type).toBe("MutuallyExclusive");
    expect(updatedQuestionnaireAnswers[0].options).toHaveLength(2);
  });
});
