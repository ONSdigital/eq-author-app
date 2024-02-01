const addValidationToListCollectorAnswers = require("./addValidationToListCollectorAnswers");

describe("addValidationToListCollectorAnswers", () => {
  let questionnaire;

  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          id: "section-1",
          folders: [
            {
              id: "folder-1",
              listId: "list-1",
              pages: [
                {
                  id: "qualifier-page-1",
                  pageType: "ListCollectorQualifierPage",
                  answers: [
                    {
                      id: "answer-1",
                      type: "Radio",
                      options: [
                        {
                          id: "qualifier-option-positive-1",
                          label: "Qualifier positive",
                          description: "Qualifier positive description",
                        },
                        {
                          id: "qualifier-option-negative-1",
                          label: "Qualifier negative",
                          description: "Qualifier negative description",
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "add-item-page-1",
                  pageType: "ListCollectorAddItemPage",
                  title: `Add item question`,
                  pageDescription: `Add item description`,
                },
                {
                  id: "confirmation-page-1",
                  pageType: "ListCollectorConfirmationPage",
                  title: `Confirmation question`,
                  pageDescription: `Confirmation description`,
                  answers: [
                    {
                      id: "answer-2",
                      type: "Radio",
                      options: [
                        {
                          id: "confirmation-option-positive-1",
                          label: "Confirmation positive",
                          description: "Confirmation positive description",
                        },
                        {
                          id: "confirmation-option-negative-1",
                          label: "Confirmation negative",
                          description: "Confirmation negative description",
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

  it("should add validation to list collector answers", () => {
    const updatedQuestionnaire =
      addValidationToListCollectorAnswers(questionnaire);

    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0].validation
    ).not.toBeUndefined();
    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0].validation
    ).toEqual({});

    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0].validation
    ).not.toBeUndefined();
    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0].validation
    ).toEqual({});
  });

  it("should not change validation on list collector answers if validation is defined", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0].validation = {
      id: "qualifier-answer-validation-1",
    };
    questionnaire.sections[0].folders[0].pages[2].answers[0].validation = {
      id: "confirmation-answer-validation-1",
    };
    const updatedQuestionnaire =
      addValidationToListCollectorAnswers(questionnaire);

    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0].validation
    ).not.toBeUndefined();
    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0].validation
    ).toEqual({ id: "qualifier-answer-validation-1" });

    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0].validation
    ).not.toBeUndefined();
    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0].validation
    ).toEqual({ id: "confirmation-answer-validation-1" });
  });

  it("should not add validation to non-list-collector answers", () => {
    questionnaire.sections[0].folders[0].pages[0].pageType = "QuestionPage";

    const updatedQuestionnaire =
      addValidationToListCollectorAnswers(questionnaire);

    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0].validation
    ).toBeUndefined();
    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0].validation
    ).not.toEqual({});

    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0].validation
    ).not.toBeUndefined();
    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0].validation
    ).toEqual({});
  });

  it("should not add validation to answers in non-list-collector folders", () => {
    questionnaire.sections[0].folders[1] = {
      id: "folder-2",
      pages: [
        {
          id: "page-2",
          answers: [
            {
              id: "answer-3",
              type: "Radio",
              options: [
                {
                  id: "qualifier-option-positive-1",
                  label: "Qualifier positive",
                  description: "Qualifier positive description",
                },
                {
                  id: "qualifier-option-negative-1",
                  label: "Qualifier negative",
                  description: "Qualifier negative description",
                },
              ],
            },
          ],
        },
      ],
    };

    const updatedQuestionnaire =
      addValidationToListCollectorAnswers(questionnaire);

    expect(
      updatedQuestionnaire.sections[0].folders[1].pages[0].answers[0].validation
    ).toBeUndefined();
    expect(
      updatedQuestionnaire.sections[0].folders[1].pages[0].answers[0].validation
    ).not.toEqual({});
  });
});
