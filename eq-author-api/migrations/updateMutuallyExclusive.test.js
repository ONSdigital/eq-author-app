const updateMutuallyExclusive = require("./updateMutuallyExclusive");

describe("Migration: fix qcode", () => {
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
                      type: "MutuallyExclusive",
                      qCode: "",
                      label: "How many pets do you have?",
                      options: [
                        {
                          id: "exclusive-1",
                          qCode: "MEQCodeFromOpt1",
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

  it("should copy first options qcode to answer qcode and delete option qcode", () => {
    updateMutuallyExclusive(questionnaire);
    const questionnaireAnswers =
      questionnaire.sections[0].folders[0].pages[0].answers;

    expect(questionnaireAnswers[0].qCode).toBe("MEQCodeFromOpt1");
    expect(questionnaireAnswers[0].options[0].qCode).toBe(undefined);
  });

  it("should not copy first options qcode to answer qcode if answer qcode already present", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0] = {
      qCode: "QCodePresent",
      type: "MutuallyExclusive",
      options: [{ qCode: "MEQCodeFromOpt1" }],
    };

    updateMutuallyExclusive(questionnaire);
    const questionnaireAnswers =
      questionnaire.sections[0].folders[0].pages[0].answers;
    expect(questionnaireAnswers[0].qCode).toBe("QCodePresent");
    expect(questionnaireAnswers[0].options[0].qCode).toBe(undefined);
  });

  it("should not update if already set from earlier option", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0] = {
      qCode: "",
      type: "MutuallyExclusive",
      options: [
        { qCode: "MEQCodeFromOpt1" },
        { qCode: "MEQCodeFromOpt2" },
        { qCode: "MEQCodeFromOpt3" },
      ],
    };

    updateMutuallyExclusive(questionnaire);
    const questionnaireAnswers =
      questionnaire.sections[0].folders[0].pages[0].answers;
    expect(questionnaireAnswers[0].qCode).toBe("MEQCodeFromOpt1");
    expect(questionnaireAnswers[0].options[0].qCode).toBe(undefined);
    expect(questionnaireAnswers[0].options[1].qCode).toBe(undefined);
    expect(questionnaireAnswers[0].options[2].qCode).toBe(undefined);
  });
});
