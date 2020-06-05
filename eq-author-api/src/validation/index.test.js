const {
  BASIC_ANSWERS,
  CURRENCY,
  NUMBER,
  UNIT,
  PERCENTAGE,
  DATE,
  DATE_RANGE,
} = require("../../constants/answerTypes");

const {
  ERR_MAX_LENGTH_TOO_LARGE,
  ERR_MAX_LENGTH_TOO_SMALL,
} = require("../../constants/validationErrorCodes");

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
                  type: NUMBER,
                  label: "Number",
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should not return pageErrors on valid schema", () => {
    const validationPageErrors = validation(questionnaire);
    expect(validationPageErrors.totalCount).toEqual(0);
  });

  describe("Question page validation", () => {
    it("should validate that a title is required", () => {
      const page = questionnaire.sections[0].pages[0];
      page.title = "";

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors.pages[page.id].errors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "title",
        id: "pages-page_1-title",
        type: "pages",
      });
    });

    it("should validate that it has at least one answer", () => {
      const page = questionnaire.sections[0].pages[0];
      page.answers = [];

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors.pages[page.id].errors[0]).toMatchObject({
        errorCode: "ERR_NO_ANSWERS",
        field: "answers",
        id: "pages-page_1-answers",
        type: "pages",
      });
    });
  });

  describe("Confirmation Question validation", () => {
    let confirmationId, confirmation;
    beforeEach(() => {
      confirmationId = "confirmationPage";
      confirmation = {
        id: confirmationId,
        title: "Hello",
        positive: {
          id: "positive",
          label: "Food",
          description: "",
        },
        negative: {
          id: "negative",
          label: "No Food",
          description: "",
        },
      };
    });

    it("should validate that a title is required", () => {
      confirmation.title = "";
      const page = questionnaire.sections[0].pages[0];
      page.confirmation = confirmation;

      const validationPageErrors = validation(questionnaire);

      expect(
        validationPageErrors.confirmation[confirmationId].errors[0]
      ).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "title",
        id: "confirmation-confirmationPage-title",
        type: "confirmation",
      });
    });

    it("should validate the options and return them on the parent", () => {
      confirmation.positive.label = "";
      const page = questionnaire.sections[0].pages[0];
      page.confirmation = confirmation;

      const validationPageErrors = validation(questionnaire);

      expect(
        validationPageErrors.confirmation[confirmationId].errors[0]
      ).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "label",
        id: "positive-positive-label",
        type: "confirmationoption",
      });
      expect(
        validationPageErrors.confirmationoption.positive.errors[0]
      ).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "label",
        id: "positive-positive-label",
        type: "confirmationoption",
      });
    });
  });

  describe("Option validation", () => {
    it("should return correct error type for additionalAnswer", () => {
      const additionalAnswer = {
        id: "additionalAnswer_1",
        type: "TextField",
        label: "",
      };
      const answer = {
        id: "answer_1",
        type: "Checkbox",
        options: [
          {
            id: "option_1",
            label: "option label",
            additionalAnswer,
          },
        ],
      };
      questionnaire.sections[0].pages[0].answers = [answer];

      const validationPageErrors = validation(questionnaire);
      expect(
        validationPageErrors.answers[additionalAnswer.id].errors[0]
      ).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "label",
        id: "additionalAnswer-additionalAnswer_1-label",
        type: "answers",
      });
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

          const pageErrors = validation(questionnaire);
          expect(pageErrors.answers[answer.id].errors).toHaveLength(1);
          expect(pageErrors.answers[answer.id].errors[0]).toMatchObject({
            errorCode: "ERR_VALID_REQUIRED",
            field: "label",
            id: `answers-${answer.id}-label`,
            type: "answers",
          });

          answer.label = "some label";

          const pageErrors2 = validation(questionnaire);
          expect(pageErrors2.answers[answer.id]).toBeUndefined();
        });
      });
      it("should recognize mismatched decimals in validation references", () => {
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
                      type: NUMBER,
                      label: "Number",
                      properties: { decimals: 2 },
                      validation: {
                        minValue: {
                          id: "minValue",
                          enabled: true,
                          entityType: "PreviousAnswer",
                          previousAnswer: "answer_1",
                        },
                      },
                    },
                  ],
                },
                {
                  id: "page_2",
                  title: "page title",
                  answers: [
                    {
                      id: "answer_2",
                      type: NUMBER,
                      label: "Number",
                      properties: { decimals: 1 },
                      validation: {
                        minValue: {
                          id: "minValue",
                          enabled: true,
                          entityType: "PreviousAnswer",
                          previousAnswer: "answer_1",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        const answer = questionnaire.sections[0].pages[1].answers[0];
        const validationPageErrors = validation(questionnaire);
        expect(validationPageErrors.answers[answer.id].errors).toHaveLength(1);
        expect(validationPageErrors.answers[answer.id].errors[0]).toMatchObject(
          {
            errorCode: "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY",
            field: "properties",
            id: "answers-answer_2-properties",
            type: "answers",
          }
        );
      });
    });

    describe("textarea answers", () => {
      describe("should validate values are between 10 and 2000 inclusive", () => {
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
                        label: "Desc",
                        properties: { maxLength: "50" },
                      },
                    ],
                  },
                ],
              },
            ],
          };
        });
        it(`and return an error for values less than 10 in textarea answer`, () => {
          questionnaire.sections[0].pages[0].answers[0].properties.maxLength =
            "9";
          const validationPageErrors = validation(questionnaire);
          const pagepageErrors = validationPageErrors.pages.page_1.errors;

          expect(pagepageErrors[0]).toMatchObject({
            errorCode: ERR_MAX_LENGTH_TOO_SMALL,
            field: "properties",
            id: "answers-answer_1-properties",
            type: "answers",
          });
        });

        it(`and allow for values of 10 or more in textarea answer`, () => {
          const validationPageErrors = validation(questionnaire);
          expect(validationPageErrors.totalCount).toBe(0);
        });

        it(`and allow for values of 2000 or less in textarea answer`, () => {
          const validationPageErrors = validation(questionnaire);
          expect(validationPageErrors.totalCount).toBe(0);
        });

        it(`and return and error for values greater than 2000 in textarea answer`, () => {
          questionnaire.sections[0].pages[0].answers[0].properties.maxLength =
            "2001";
          const validationPageErrors = validation(questionnaire);
          const pageErrors = validationPageErrors.pages.page_1.errors;

          expect(pageErrors[0]).toMatchObject({
            errorCode: ERR_MAX_LENGTH_TOO_LARGE,
            field: "properties",
            id: "answers-answer_1-properties",
            type: "answers",
          });
        });
      });
    });

    describe("all date answers", () => {
      let answer;
      beforeEach(() => {
        answer = {
          id: "a1",
          type: "Date",
          label: "some answer",
          validation: {
            earliestDate: {
              id: "123",
              enabled: true,
              custom: "2019-08-12",
              inclusive: true,
              entityType: "Custom",
              previousAnswer: null,
              offset: {
                value: 1,
                unit: "Years",
              },
              relativePosition: "After",
            },
            latestDate: {
              id: "321",
              enabled: true,
              custom: "2019-08-11",
              inclusive: true,
              entityType: "Custom",
              previousAnswer: null,
              offset: {
                value: 3,
                unit: "Days",
              },
              relativePosition: "Before",
            },
          },
        };

        questionnaire = {
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
      });
      describe("date only answers", () => {
        it("should validate that latest date is always after earlier date", () => {
          const pageErrors = validation(questionnaire);

          expect(
            pageErrors.validation[answer.validation.earliestDate.id].errors
          ).toHaveLength(1);
          expect(
            pageErrors.validation[answer.validation.earliestDate.id].errors[0]
              .errorCode
          ).toEqual("ERR_EARLIEST_AFTER_LATEST");
          expect(pageErrors.totalCount).toBe(1);
        });

        it("should not validate if one of the two is disabled", () => {
          ["earliestDate", "latestDate", "none"].forEach(entity => {
            const answer = {
              id: "a1",
              type: DATE,
              label: "some answer",
              validation: {
                earliestDate: {
                  id: "123",
                  enabled: entity === "earliestDate",
                  custom: "2019-06-23",
                  inclusive: true,
                  entityType: "Custom",
                  previousAnswer: null,
                },
                latestDate: {
                  id: "321",
                  enabled: entity === "latestDate",
                  custom: "2019-06-23",
                  inclusive: true,
                  entityType: "Custom",
                  previousAnswer: null,
                },
              },
            };

            questionnaire.sections[0].pages[0].answers = [answer];

            const pageErrors = validation(questionnaire);

            expect(pageErrors.validation).toMatchObject({});
            expect(pageErrors.totalCount).toBe(0);
          });
        });
      });

      describe("date range answers", () => {
        it("Date Range - should validate that latest date is always after earlier date", () => {
          questionnaire.sections[0].pages[0].answers = [answer];

          const pageErrors = validation(questionnaire);

          expect(
            pageErrors.validation[answer.validation.earliestDate.id].errors
          ).toHaveLength(1);
          expect(
            pageErrors.validation[answer.validation.earliestDate.id].errors[0]
              .errorCode
          ).toEqual("ERR_EARLIEST_AFTER_LATEST");
          expect(pageErrors.totalCount).toBe(1);
        });

        it("Date Range - should not validate if one of the two is disabled", () => {
          ["earliestDate", "latestDate", "none"].forEach(entity => {
            const answer = {
              id: "a1",
              type: DATE_RANGE,
              label: "some answer",
              validation: {
                earliestDate: {
                  id: "123",
                  enabled: entity === "earliestDate",
                  custom: "2019-06-23",
                  inclusive: true,
                  entityType: "Custom",
                  previousAnswer: null,
                },
                latestDate: {
                  id: "321",
                  enabled: entity === "latestDate",
                  custom: "2019-06-23",
                  inclusive: true,
                  entityType: "Custom",
                  previousAnswer: null,
                },
              },
            };

            questionnaire.sections[0].pages[0].answers = [answer];

            const pageErrors = validation(questionnaire);

            expect(pageErrors.validation).toMatchObject({});
            expect(pageErrors.totalCount).toBe(0);
          });
        });
      });
    });

    describe("currency, number, percentage and unit answers", () => {
      it("should ensure that max value is always larger than min value", () => {
        [CURRENCY, NUMBER, UNIT, PERCENTAGE].forEach(type => {
          const answer = {
            id: "a1",
            type,
            label: "some answer",
            validation: {
              minValue: {
                id: "123",
                enabled: true,
                custom: 50,
                inclusive: true,
                entityType: "Custom",
                previousAnswer: null,
              },
              maxValue: {
                id: "321",
                enabled: true,
                custom: 40,
                inclusive: true,
                entityType: "Custom",
                previousAnswer: null,
              },
            },
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

          expect(
            errors.validation[answer.validation.minValue.id].errors
          ).toHaveLength(1);
          expect(errors.validation).toMatchObject({
            "123": {
              errors: [
                {
                  entityId: "123",
                  errorCode: "ERR_MIN_LARGER_THAN_MAX",
                  field: "custom",
                  id: "minValue-123-custom",
                  type: "validation",
                },
              ],
              id: "123",
              totalCount: 1,
            },
            "321": {
              errors: [
                {
                  entityId: "321",
                  errorCode: "ERR_MIN_LARGER_THAN_MAX",
                  field: "custom",
                  id: "maxValue-321-custom",
                  type: "validation",
                },
              ],

              id: "321",
              totalCount: 1,
            },
          });
          expect(errors.totalCount).toBe(1);
          expect(errors.pages.p1.totalCount).toBe(1);

          answer.validation.maxValue.custom = 80;

          const errors2 = validation(questionnaire);
          expect(errors2.validation).toMatchObject({});
        });
      });

      it("should not validate if one of the two is disabled", () => {
        ["minValue", "maxValue", "none"].forEach(entity => {
          const answer = {
            id: "a1",
            type: NUMBER,
            label: "some answer",
            validation: {
              minValue: {
                id: "123",
                enabled: entity === "minValue",
                custom: 50,
                inclusive: true,
                entityType: "Custom",
                previousAnswer: null,
              },
              maxValue: {
                id: "321",
                enabled: entity === "maxValue",
                custom: 40,
                inclusive: true,
                entityType: "Custom",
                previousAnswer: null,
              },
            },
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
          const pageErrors = validation(questionnaire);

          expect(pageErrors.validation).toMatchObject({});
          expect(pageErrors.totalCount).toBe(0);
        });
      });

      it("should not validate if one of the two is a previous answer", () => {
        ["minValue", "maxValue", "none"].forEach(entity => {
          const answer = {
            id: "a1",
            type: NUMBER,
            label: "some answer",
            validation: {
              minValue: {
                id: "123",
                enabled: entity === "minValue",
                custom: 50,
                inclusive: true,
                entityType: "Custom",
                previousAnswer: null,
              },
              maxValue: {
                id: "321",
                enabled: entity === "maxValue",
                custom: 40,
                inclusive: true,
                entityType: "PreviousAnswer",
                previousAnswer: { displayName: "a previous answer", id: "1" },
              },
            },
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
          const pageErrors = validation(questionnaire);

          expect(pageErrors.validation).toMatchObject({});
          expect(pageErrors.totalCount).toBe(0);
        });
      });
    });
  });

  describe("Section validation", () => {
    it("should return an error when navigation is enabled but there is no section title", () => {
      questionnaire.navigation = true;
      const section = questionnaire.sections[0];
      section.title = "";

      const validationPageErrors = validation(questionnaire);
      const sectionPageErrors =
        validationPageErrors.sections[section.id].errors;
      expect(sectionPageErrors).toHaveLength(1);
      expect(sectionPageErrors[0]).toMatchObject({
        errorCode: "ERR_REQUIRED_WHEN_SETTING",
        field: "title",
        id: "sections-section_1-title",
        type: "sections",
      });
    });

    it("should NOT return an error when navigation is disabled but there is no section title", () => {
      questionnaire.navigation = false;
      const section = questionnaire.sections[0];
      section.title = "";

      const validationPageErrors = validation(questionnaire);
      const sectionpageErrors = validationPageErrors.sections[section.id];
      expect(sectionpageErrors).toBeUndefined();
    });

    it("should NOT return an error when navigation is enabled and there is a title", () => {
      questionnaire.navigation = true;
      const section = questionnaire.sections[0];
      section.title = "Section title";

      const validationPageErrors = validation(questionnaire);
      const sectionpageErrors = validationPageErrors.sections[section.id];
      expect(sectionpageErrors).toBeUndefined();
    });
  });
});
