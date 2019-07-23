const { BASIC_ANSWERS } = require("../../constants/answerTypes");

const validation = require(".");

describe("schema validation", () => {
  let questionnaire;

  beforeEach(() => {
    questionnaire = {
      id: "1",
      sections: [
        {
          id: "section_1",
          title: "section_1",
          pages: [
            {
              id: "page_1",
              title: "page title",
              answers: [
                {
                  id: "answer_1",
                  type: "Checkbox",
                  options: [
                    {
                      id: "option_1",
                      label: "option label",
                      additionalAnswer: {
                        id: "additionalAnswer_1",
                        type: "TextField",
                        label: "additional answer label",
                      },
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

  it("should not return errors on valid schema", () => {
    const validationErrors = validation(questionnaire);
    expect(validationErrors.totalCount).toEqual(0);
  });

  it("should return errors on invalid schema", () => {
    const page = questionnaire.sections[0].pages[0];
    page.title = "";

    const validationErrors = validation(questionnaire);

    expect(validationErrors.pages[page.id].errors[0]).toMatchObject({
      errorCode: "ERR_VALID_REQUIRED",
      field: "title",
      id: "page_1",
      type: "pages",
    });
  });

  it("should return correct error type for additionalAnswer", () => {
    const answer =
      questionnaire.sections[0].pages[0].answers[0].options[0].additionalAnswer;
    answer.label = "";

    const validationErrors = validation(questionnaire);

    expect(validationErrors.answers[answer.id].errors[0]).toMatchObject({
      errorCode: "ERR_VALID_REQUIRED",
      field: "label",
      id: "additionalAnswer_1",
      type: "answers",
    });
  });

  describe("Answer validation", () => {
    describe("basic answer", () => {
      it("should ensure that the label is populated", () => {
        BASIC_ANSWERS.forEach(type => {
          const answer = {
            id: "a1",
            type,
            label: "",
          };
          const questionnaire = {
            id: "q1",
            sections: [
              {
                id: "s1",
                pages: [
                  {
                    id: "p1",
                    answers: [answer],
                  },
                ],
              },
            ],
          };

          const errors = validation(questionnaire);
          expect(errors.answers[answer.id].errors).toHaveLength(1);
          expect(errors.answers[answer.id].errors[0]).toMatchObject({
            errorCode: "ERR_VALID_REQUIRED",
            field: "label",
            id: answer.id,
            type: "answers",
          });

          answer.label = "some label";

          const errors2 = validation(questionnaire);
          expect(errors2.answers[answer.id]).toBeUndefined();
        });
      });
    });
  });

  describe("Section validation", () => {
    it("should return an error when navigation is enabled but there is no section title", () => {
      questionnaire.navigation = true;
      const section = questionnaire.sections[0];
      section.title = "";

      const validationErrors = validation(questionnaire);
      const sectionErrors = validationErrors.sections[section.id].errors;
      expect(sectionErrors).toHaveLength(1);
      expect(sectionErrors[0]).toMatchObject({
        errorCode: "ERR_REQUIRED_WHEN_SETTING",
        field: "title",
        id: section.id,
        type: "sections",
      });
    });

    it("should NOT return an error when navigation is disabled but there is no section title", () => {
      questionnaire.navigation = false;
      const section = questionnaire.sections[0];
      section.title = "";

      const validationErrors = validation(questionnaire);
      const sectionErrors = validationErrors.sections[section.id];
      expect(sectionErrors).toBeUndefined();
    });

    it("should NOT return an error when navigation is enabled and there is a title", () => {
      questionnaire.navigation = true;
      const section = questionnaire.sections[0];
      section.title = "Section title";

      const validationErrors = validation(questionnaire);
      const sectionErrors = validationErrors.sections[section.id];
      expect(sectionErrors).toBeUndefined();
    });
  });
});
