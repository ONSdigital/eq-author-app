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
                          description: "Do not have any pets",
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
    convertMutuallyExclusiveOptions(questionnaire);
    const questionnaireAnswers =
      questionnaire.sections[0].folders[0].pages[0].answers;

    expect(questionnaireAnswers.length).toBe(2);
    expect(questionnaireAnswers[0].options).toBeUndefined();
    expect(questionnaireAnswers[0].type).toBe("Number");
    expect(questionnaireAnswers[1].type).toBe("MutuallyExclusive");
    expect(questionnaireAnswers[1].questionPageId).toBe("page-1");
    expect(questionnaireAnswers[1].options.length).toBe(1);
    expect(questionnaireAnswers[1].options[0].label).toBe("No pets");
    expect(questionnaireAnswers[1].options[0].description).toBe(
      "Do not have any pets"
    );
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
          description: "Test description",
          mutuallyExclusive: true,
        },
      ],
    };

    const questionnaireAnswers =
      questionnaire.sections[0].folders[0].pages[0].answers;
    expect(questionnaireAnswers).toHaveLength(1);
    expect(questionnaireAnswers[0].type).toBe("Checkbox");
    expect(questionnaireAnswers[0].options).toHaveLength(3);
    expect(questionnaireAnswers[0].options[2].label).toBe("Don't know");
    expect(questionnaireAnswers[0].options[2].description).toBe(
      "Test description"
    );

    convertMutuallyExclusiveOptions(questionnaire);

    expect(questionnaireAnswers).toHaveLength(2);
    expect(questionnaireAnswers[0].options).toHaveLength(2);
    expect(questionnaireAnswers[0].type).toBe("Checkbox");
    expect(questionnaireAnswers[1].type).toBe("MutuallyExclusive");
    expect(questionnaireAnswers[1].type).toBe("MutuallyExclusive");
    expect(questionnaireAnswers[1].options[0].label).toBe("Don't know");
    expect(questionnaireAnswers[1].options[0].description).toBe(
      "Test description"
    );
  });
});
