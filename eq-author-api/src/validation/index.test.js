const {
  BASIC_ANSWERS,
  CURRENCY,
  NUMBER,
  UNIT,
  PERCENTAGE,
  DATE,
  DATE_RANGE,
} = require("../../constants/answerTypes");

const { GREATER_THAN } = require("../../constants/validationConditions");

const { CUSTOM, ANSWER } = require("../../constants/validationEntityTypes");

const { AND } = require("../../constants/routingOperators");

const {
  ERR_NO_THEME_ENABLED,
  ERR_MAX_LENGTH_TOO_LARGE,
  ERR_MAX_LENGTH_TOO_SMALL,
  ERR_ANSWER_NOT_SELECTED,
  ERR_RIGHTSIDE_NO_VALUE,
  ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE,
  ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND,
  ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
  ERR_DESTINATION_MOVED,
  ERR_DESTINATION_REQUIRED,
  ERR_DESTINATION_DELETED,
  PIPING_TITLE_DELETED,
  PIPING_TITLE_MOVED,
  ERR_LOGICAL_AND,
  ERR_NO_VALUE,
  ERR_REFERENCE_DELETED,
  ERR_REFERENCE_MOVED,
  ERR_VALID_REQUIRED,
  ERR_INVALID,
  ERR_DESTINATION_INVALID_WITH_HUB,
  PIPING_METADATA_DELETED,
  CALCSUM_MOVED,
  ERR_SEC_CONDITION_NOT_SELECTED,
  ERR_COUNT_OF_GREATER_THAN_AVAILABLE_OPTIONS,
} = require("../../constants/validationErrorCodes");

const validation = require(".");
const { NEXT_PAGE } = require("../../constants/logicalDestinations");

const uuidRejex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const addExpression = ({ questionnaire, number, condition }) => {
  questionnaire.sections[0].folders[0].pages[1].routing.rules[0].expressionGroup.expressions.push(
    {
      id: "expression_2",
      condition,
      left: {
        answerId: "answer_1",
      },
      right: {
        type: CUSTOM,
        customValue: {
          number,
        },
      },
    }
  );
};

describe("schema validation", () => {
  let questionnaire;

  beforeEach(() => {
    questionnaire = {
      id: "1",
      type: "Business",
      sections: [
        {
          id: "section_1",
          title: "section_1",
          folders: [
            {
              id: "folder_1",
              enabled: "false",
              pages: [
                {
                  id: "page_1",
                  title: "page title",
                  answers: [
                    {
                      id: "answer_1",
                      type: NUMBER,
                      label: "Number",
                      qCode: "qCode1",
                      properties: {
                        required: false,
                        decimals: 0,
                      },
                      validation: {
                        minValue: {
                          id: "wadnawd",
                          enabled: false,
                          validationType: "minValue",
                        },
                        maxValue: {
                          id: "awdawdawd",
                          enabled: false,
                          validationType: "maxValue",
                        },
                      },
                    },
                    {
                      id: "answer_12",
                      type: NUMBER,
                      label: "Number",
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
                      qCode: "qCode4",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      metadata: [
        {
          id: "87c64b20-9662-408b-b674-e2403e90dad3",
          key: "ru_name",
          alias: "Ru Name",
          type: "Text",
          textValue: "ESSENTIAL ENTERPRISE LTD.",
        },
        {
          id: "fa7be01a-b1c6-4983-af90-bd06150d2808",
          key: "trad_as",
          alias: "Trad As",
          type: "Text_Optional",
          textValue: "ESSENTIAL ENTERPRISE LTD.",
        },
        {
          id: "ffb5ddb5-d746-4d3f-8016-d5c5547c939a",
          key: "period_id",
          alias: "Period Id",
          type: "Text",
          textValue: "201605",
        },
        {
          id: "fe06fcc3-5fd8-4491-afc0-9f3ad8e1d52a",
          key: "ref_p_start_date",
          alias: "Start Date",
          type: "Date",
          dateValue: "2016-05-01",
        },
        {
          id: "9f71966e-50c6-4fbf-95bc-4813db9d0bab",
          key: "ref_p_end_date",
          alias: "End Date",
          type: "Date",
          dateValue: "2016-06-12",
        },
      ],
    };
  });

  it("should not return pageErrors on valid schema", () => {
    const validationPageErrors = validation(questionnaire);
    expect(validationPageErrors.length).toEqual(0);
  });

  describe("Themes validation", () => {
    it("should return an error if all themes are disabled", () => {
      questionnaire.themeSettings = {
        id: "ts-1",
        previewTheme: "business",
        themes: [
          {
            id: "theme-1",
            enabled: false,
            shortName: "northernireland",
            legalBasisCode: "NOTICE_1",
            eqId: "dave",
            formType: "777",
          },
          {
            id: "theme-2",
            enabled: false,
            shortName: "business",
            legalBasisCode: "NOTICE_1",
            eqId: "ivan",
            formType: "888",
          },
        ],
      };

      const errors = validation(questionnaire);

      expect(errors[0].errorCode).toBe(ERR_NO_THEME_ENABLED);
    });

    it("should return an error if survey ID missing", () => {
      questionnaire.surveyId = null;
      const errors = validation(questionnaire);
      expect(errors[0].errorCode).toBe(ERR_VALID_REQUIRED);
    });

    it("should return an error if survey ID invalid", () => {
      questionnaire.surveyId = "cat";
      const errors = validation(questionnaire);
      expect(errors[0].errorCode).toBe(ERR_INVALID);
    });

    it("should return an error if survey ID is missing on a social survey", () => {
      questionnaire.surveyId = null;
      questionnaire.type = "Social";
      const errors = validation(questionnaire);
      expect(errors[0].errorCode).toBe(ERR_VALID_REQUIRED);
    });
  });

  describe("Question page validation", () => {
    it("should validate that a title is required", () => {
      const page = questionnaire.sections[0].folders[0].pages[0];
      page.title = "";

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "title",
        id: uuidRejex,
        type: "page",
      });
    });

    it("should validate that it has at least one answer", () => {
      const page = questionnaire.sections[0].folders[0].pages[0];
      page.answers = [];

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_NO_ANSWERS",
        field: "answers",
        id: uuidRejex,
        type: "page",
      });
    });

    it("should validate that question description has been filled in when enabled", () => {
      const page = questionnaire.sections[0].folders[0].pages[0];
      page.descriptionEnabled = true;
      page.description = "";

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "description",
        id: uuidRejex,
        type: "page",
      });
    });

    it("should validate that additional info label has been filled in when enabled", () => {
      const page = questionnaire.sections[0].folders[0].pages[0];
      page.additionalInfoEnabled = true;
      page.additionalInfoLabel = "";

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "additionalInfoLabel",
        id: uuidRejex,
        type: "page",
      });
    });

    it("should validate that additional info content has been filled in when enabled", () => {
      const page = questionnaire.sections[0].folders[0].pages[0];
      page.additionalInfoEnabled = true;
      page.additionalInfoContent = "";

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "additionalInfoContent",
        id: uuidRejex,
        type: "page",
      });
    });

    it("should validate that include/exclude guidance has been filled in when enabled", () => {
      const page = questionnaire.sections[0].folders[0].pages[0];
      page.guidanceEnabled = true;
      page.guidance = "";

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "guidance",
        id: uuidRejex,
        type: "page",
      });
    });

    it("should validate that include/exclude guidance is not null", () => {
      const page = questionnaire.sections[0].folders[0].pages[0];
      page.guidanceEnabled = true;
      page.guidance = null;

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "guidance",
        id: uuidRejex,
        type: "page",
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
      const page = questionnaire.sections[0].folders[0].pages[0];
      page.confirmation = confirmation;

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "title",
        id: uuidRejex,
        type: "confirmation",
      });
    });

    it("should validate the options and return them on the parent", () => {
      confirmation.positive.label = "";
      const page = questionnaire.sections[0].folders[0].pages[0];
      page.confirmation = confirmation;

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "label",
        id: uuidRejex,
        type: "confirmationOption",
        confirmationOptionType: "positive",
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
      questionnaire.sections[0].folders[0].pages[0].answers = [answer];

      const validationPageErrors = validation(questionnaire);
      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ADDITIONAL_LABEL_MISSING",
        field: "label",
        id: uuidRejex,
        type: "option-additionalAnswer",
      });
    });
  });

  describe("Answer validation", () => {
    describe("basic answer", () => {
      it("should ensure that the label is populated", () => {
        BASIC_ANSWERS.forEach((type) => {
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
                folders: [
                  {
                    pages: [
                      {
                        id: "p1",
                        answers: [answer],
                      },
                    ],
                  },
                ],
              },
            ],
          };

          const pageErrors = validation(questionnaire);
          expect(pageErrors).toHaveLength(1);
          expect(pageErrors[0]).toMatchObject({
            errorCode: "ERR_VALID_REQUIRED",
            field: "label",
            id: uuidRejex,
            type: "answer",
          });

          answer.label = "some label";

          const pageErrors2 = validation(questionnaire);
          expect(pageErrors2).toHaveLength(0);
        });
      });

      describe("piping answer in label", () => {
        it("should validate a deleted piped answer in a label", () => {
          const piping = validation(questionnaire);
          expect(piping).toHaveLength(0);

          questionnaire.sections[0].folders[0].pages[0].answers[0].label = `<p><span data-piped="answers" data-id="answer_33" data-type="Percentage">[Some answer]</span></p>`;

          const errors = validation(questionnaire);
          expect(errors).toHaveLength(1);
          expect(errors[0].errorCode).toBe(PIPING_TITLE_DELETED);
        });

        it("should not return piping answer error when piped answer is in a title", () => {
          const piping = validation(questionnaire);
          expect(piping).toHaveLength(0);

          questionnaire.sections[0].folders[0].pages[0].answers[1].label = `<p><span data-piped="answers" data-id="answer_1" data-type="Number">[Some answer]</span></p>`;

          const errors = validation(questionnaire);
          expect(errors).toHaveLength(0);
        });

        it("should validate a piping answer moved after this question", () => {
          const piping = validation(questionnaire);
          expect(piping).toHaveLength(0);

          questionnaire.sections[0].folders[0].pages[0].answers[0].label = `<p><span data-piped="answers" data-id="answer_2" data-type="Number">[number]</span></p>`;

          const errors = validation(questionnaire);
          expect(errors).toHaveLength(1);
          expect(errors[0].errorCode).toBe(PIPING_TITLE_MOVED);
        });

        it("should validate a deleted piping answer in label", () => {
          const piping = validation(questionnaire);
          expect(piping).toHaveLength(0);

          questionnaire.sections[0].folders[0].pages[0].answers[0].label = `<p><span data-piped="answers" data-id="answer_99" data-type="Number">[number]</span></p>`;

          const errors = validation(questionnaire);
          expect(errors).toHaveLength(1);
          expect(errors[0].errorCode).toBe(PIPING_TITLE_DELETED);
        });
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
                folders: [
                  {
                    pages: [
                      {
                        id: "page_1",
                        title: "page title",
                        answers: [
                          {
                            id: "answer_1",
                            label: "Desc",
                            qCode: "qCode1",
                            secondaryQCode: "secQCode1",
                            properties: { maxLength: 50 },
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
        it(`and return an error for values less than 10 in textarea answer`, () => {
          questionnaire.sections[0].folders[0].pages[0].answers[0].properties.maxLength = 9;
          const validationPageErrors = validation(questionnaire);
          const pagepageErrors = validationPageErrors;

          expect(pagepageErrors[0]).toMatchObject({
            errorCode: ERR_MAX_LENGTH_TOO_SMALL,
            field: "maxLength",
            id: uuidRejex,
            type: "answer",
          });
        });

        it(`and allow for values of 10 or more in textarea answer`, () => {
          const validationPageErrors = validation(questionnaire);
          expect(validationPageErrors).toHaveLength(0);
        });

        it(`and allow for values of 2000 or less in textarea answer`, () => {
          const validationPageErrors = validation(questionnaire);
          expect(validationPageErrors).toHaveLength(0);
        });

        it(`and return and error for values greater than 2000 in textarea answer`, () => {
          questionnaire.sections[0].folders[0].pages[0].answers[0].properties.maxLength = 2001;
          const validationPageErrors = validation(questionnaire);
          const pageErrors = validationPageErrors;

          expect(pageErrors[0]).toMatchObject({
            errorCode: ERR_MAX_LENGTH_TOO_LARGE,
            field: "maxLength",
            id: uuidRejex,
            type: "answer",
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
          qCode: "qCode1",
          secondaryQCode: "secQCode1",
          validation: {
            earliestDate: {
              id: "123",
              enabled: true,
              custom: null,
              inclusive: true,
              entityType: "Metadata",
              previousAnswer: null,
              offset: {
                value: 1,
                unit: "Years",
              },
              metadata: "meta-start-date",
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
            minDuration: {
              id: "456",
              enabled: true,
              duration: {
                value: 5,
                unit: "Days",
              },
            },
            maxDuration: {
              id: "654",
              enabled: true,
              duration: {
                value: 1,
                unit: "Days",
              },
            },
          },
        };

        questionnaire = {
          id: "q1",
          metadata: [
            {
              id: "meta-start-date",
              key: "ref_p_start_date",
              alias: "Start Date",
              type: "Date",
              dateValue: "2019-08-12",
            },
          ],
          sections: [
            {
              id: "s1",
              folders: [
                {
                  pages: [
                    {
                      id: "p1",
                      answers: [answer],
                    },
                  ],
                },
              ],
            },
          ],
        };
      });
      describe("date only answers", () => {
        it("should validate that latest date is always after earlier date", () => {
          const pageErrors = validation(questionnaire);

          expect(pageErrors).toHaveLength(1);
          expect(pageErrors[0].errorCode).toEqual("ERR_EARLIEST_AFTER_LATEST");
        });

        it("should not return an error if one of the two is disabled", () => {
          ["earliestDate", "latestDate", "none"].forEach((entity) => {
            const answer = {
              id: "a1",
              type: DATE,
              label: "some answer",
              qCode: "qCode1",
              secondaryQCode: "secQCode1",
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

            questionnaire.sections[0].folders[0].pages[0].answers = [answer];

            const pageErrors = validation(questionnaire);

            expect(pageErrors).toHaveLength(0);
          });
        });

        it("should return an error if date offset not set", () => {
          answer.validation.latestDate.offset.value = null;

          const errors = validation(questionnaire);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ errorCode: "ERR_OFFSET_NO_VALUE" }),
            ])
          );
        });

        it("should return an error if referenced answer deleted / moved", () => {
          questionnaire.sections[0].folders[0].pages[0].answers.push({
            ...answer,
            id: "a2",
          });
          questionnaire.sections[0].folders[0].pages[0].answers[0].validation =
            {
              earliestDate: {
                id: "earliest-rule-1",
                enabled: true,
                entityType: "PreviousAnswer",
                previousAnswer: "a2",
                relativePosition: "Before",
              },
              latestDate: {
                id: "latest-rule-1",
                enabled: false,
              },
            };

          let errors = validation(questionnaire);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ errorCode: "ERR_REFERENCE_MOVED" }),
            ])
          );

          questionnaire.sections[0].folders[0].pages[0].answers.splice(1, 1);
          questionnaire.updatedAt = new Date();

          errors = validation(questionnaire);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ errorCode: "ERR_REFERENCE_DELETED" }),
            ])
          );
        });
      });

      describe("date range answers", () => {
        describe("Earliest date and latest date", () => {
          it("Date Range - should validate that latest date is always after earlier date", () => {
            questionnaire.sections[0].folders[0].pages[0].answers = [answer];

            const pageErrors = validation(questionnaire);

            expect(pageErrors).toHaveLength(1);
            expect(pageErrors[0].errorCode).toEqual(
              "ERR_EARLIEST_AFTER_LATEST"
            );
          });

          it("Date Range - should not validate if one of the two is disabled", () => {
            ["earliestDate", "latestDate", "none"].forEach((entity) => {
              const answer = {
                id: "a1",
                type: DATE_RANGE,
                label: "some answer",
                qCode: "qCode1",
                secondaryQCode: "secQCode1",
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

              questionnaire.sections[0].folders[0].pages[0].answers = [answer];

              const pageErrors = validation(questionnaire);

              expect(pageErrors).toHaveLength(0);
            });
          });
        });

        describe("Min duration and max duration", () => {
          it("Date Range - should validate that latest date is always after earlier date", () => {
            questionnaire.sections[0].folders[0].pages[0].answers = [
              {
                id: "a1",
                type: "DateRange",
                label: "some answer",
                qCode: "qCode1",
                secondaryQCode: "secQCode1",
                validation: {
                  minDuration: {
                    id: "456",
                    enabled: true,
                    duration: {
                      value: 5,
                      unit: "Days",
                    },
                  },
                  maxDuration: {
                    id: "654",
                    enabled: true,
                    duration: {
                      value: 1,
                      unit: "Days",
                    },
                  },
                },
              },
            ];
            const pageErrors = validation(questionnaire);

            expect(pageErrors).toHaveLength(1);
            expect(pageErrors[0].errorCode).toEqual(
              "ERR_MAX_DURATION_TOO_SMALL"
            );
          });

          it("Date Range - should not show error when latest date is after earlier date", () => {
            questionnaire.sections[0].folders[0].pages[0].answers = [
              {
                id: "a1",
                type: "DateRange",
                label: "some answer",
                qCode: "qCode1",
                secondaryQCode: "secQCode1",
                validation: {
                  minDuration: {
                    id: "456",
                    enabled: true,
                    duration: {
                      value: 1,
                      unit: "Days",
                    },
                  },
                  maxDuration: {
                    id: "654",
                    enabled: true,
                    duration: {
                      value: 1,
                      unit: "Days",
                    },
                  },
                },
              },
            ];
            const pageErrors = validation(questionnaire);

            expect(pageErrors).toHaveLength(0);
          });

          it("Date Range - should not validate if one of the two is disabled", () => {
            ["earliestDate", "latestDate", "none"].forEach(() => {
              questionnaire.sections[0].folders[0].pages[0].answers = [
                {
                  id: "a1",
                  type: "DateRange",
                  label: "some answer",
                  qCode: "qCode1",
                  secondaryQCode: "secQCode1",
                  validation: {
                    minDuration: {
                      id: "456",
                      enabled: false,
                      duration: {
                        value: 5,
                        unit: "Days",
                      },
                    },
                    maxDuration: {
                      id: "654",
                      enabled: true,
                      duration: {
                        value: 1,
                        unit: "Days",
                      },
                    },
                  },
                },
              ];

              const pageErrors = validation(questionnaire);

              expect(pageErrors).toHaveLength(0);
            });
          });
        });
      });
    });

    describe("currency, number, percentage and unit answers", () => {
      it("should ensure that max value is always larger than min value", () => {
        [CURRENCY, NUMBER, UNIT, PERCENTAGE].forEach((type) => {
          const answer = {
            id: "a1",
            type,
            label: "some answer",
            qCode: "qCode1",
            secondaryQCode: "secQCode1",
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
                folders: [
                  {
                    pages: [
                      {
                        id: "p1",
                        answers: [answer],
                      },
                    ],
                  },
                ],
              },
            ],
          };
          const errors = validation(questionnaire);

          expect(errors).toHaveLength(1);
          expect(errors[0]).toMatchObject({
            id: uuidRejex,
            field: "custom",
            errorCode: "ERR_MIN_LARGER_THAN_MAX",
            sectionId: "s1",
            type: "validation",
            pageId: "p1",
            answerId: "a1",
            validationId: "123",
            validationProperty: "minValue",
          });

          answer.validation.maxValue.custom = 80;

          const errors2 = validation(questionnaire);
          expect(errors2).toHaveLength(0);
        });
      });

      it("should not validate if one of the two is disabled", () => {
        ["minValue", "maxValue", "none"].forEach((entity) => {
          const answer = {
            id: "a1",
            type: NUMBER,
            label: "some answer",
            qCode: "qCode1",
            secondaryQCode: "secQCode1",
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
                folders: [
                  {
                    pages: [
                      {
                        id: "p1",
                        answers: [answer],
                      },
                    ],
                  },
                ],
              },
            ],
          };
          const pageErrors = validation(questionnaire);

          expect(pageErrors).toHaveLength(0);
        });
      });

      it("should not validate if one of the two is a previous answer", () => {
        ["minValue", "maxValue", "none"].forEach((entity) => {
          const answer = {
            id: "a1",
            type: NUMBER,
            label: "some answer",
            qCode: "qCode1",
            secondaryQCode: "secQCode1",
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
                folders: [
                  {
                    pages: [
                      {
                        id: "p1",
                        answers: [answer],
                      },
                    ],
                  },
                ],
              },
            ],
          };
          const pageErrors = validation(questionnaire);

          expect(pageErrors).toHaveLength(0);
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

      expect(validationPageErrors).toHaveLength(1);
      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_REQUIRED_WHEN_SETTING",
        field: "title",
        id: uuidRejex,
        type: "section",
      });
    });

    it("should not return an error when section navigation is disabled and there is no section title", () => {
      questionnaire.navigation = false;
      const section = questionnaire.sections[0];
      section.title = "";

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors).toHaveLength(0);
    });

    it("should not return an error when section navigation is enabled and there is a title", () => {
      questionnaire.navigation = true;
      const section = questionnaire.sections[0];
      section.title = "Section title";

      const validationPageErrors = validation(questionnaire);

      expect(validationPageErrors).toHaveLength(0);
    });
  });

  describe("Routing validation", () => {
    let defaultRouting;
    beforeEach(() => {
      questionnaire.sections[0].folders[0].pages[0].routing = null;
      questionnaire.sections[0].folders[0].pages[0].skipConditions = null;
      defaultRouting = {
        id: "1",
        else: {
          id: "else-1",
          logical: "NextPage",
        },
        rules: [
          {
            id: "rule-1",
            destination: {
              id: "dest-1",
              logical: "NextPage",
            },
            expressionGroup: {
              id: "group-1",
              operator: "And",
              expressions: [
                {
                  id: "expression-1",
                  condition: "Equal",
                  left: {
                    type: "Null",
                    answerId: "",
                    nullReason: "DefaultRouting",
                  },
                },
              ],
            },
          },
        ],
      };
    });

    it("should validate empty routing rules", () => {
      let routingErrors = validation(questionnaire);
      expect(routingErrors.length).toBe(0);
    });

    it("should validate when answer not selected", () => {
      questionnaire.sections[0].folders[0].pages[0].routing = defaultRouting;
      const routingErrors = validation(questionnaire);

      expect(routingErrors.length).toBe(1);
      expect(routingErrors[0].id).toMatch(uuidRejex);
      expect(routingErrors[0].errorCode).toBe(ERR_ANSWER_NOT_SELECTED);
    });

    it("should validate left hand Answer is after routing question", () => {
      defaultRouting.rules[0].expressionGroup.expressions[0].left = {
        type: "Answer",
        answerId: "answer_2",
      };
      questionnaire.sections[0].folders[0].pages[0].routing = defaultRouting;
      const routingErrors = validation(questionnaire);

      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].id).toMatch(uuidRejex);
      expect(routingErrors[0].errorCode).toBe(ERR_LEFTSIDE_NO_LONGER_AVAILABLE);
    });

    it("should validate expression group operator - can't be null if multiple expressions exist", () => {
      defaultRouting.rules[0].expressionGroup.expressions.push({
        ...defaultRouting.rules[0].expressionGroup.expressions[0],
        id: "expr-2",
      });
      defaultRouting.rules[0].expressionGroup.operator = null;
      questionnaire.sections[0].folders[0].pages[0].routing = defaultRouting;
      const routingErrors = validation(questionnaire);

      expect(routingErrors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            errorCode: "ERR_VALUE_REQUIRED",
            field: "operator",
          }),
        ])
      );
    });

    it("should validate empty skip conditions", () => {
      const expressionId = "express-1";

      const errors = validation(questionnaire);

      expect(errors).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].skipConditions = [
        {
          id: "group-1",
          expressions: [
            {
              id: expressionId,
              condition: "Equal",
              left: {
                type: "Null",
                answerId: "",
                nullReason: "DefaultSkipCondition",
              },
            },
          ],
        },
      ];

      const skipConditionErrors = validation(questionnaire);

      expect(skipConditionErrors).toHaveLength(1);
      expect(skipConditionErrors[0].id).toMatch(uuidRejex);
      expect(skipConditionErrors[0].errorCode).toBe(ERR_ANSWER_NOT_SELECTED);
    });

    it("should validate empty right of expression", () => {
      const expressionId = "express-1";

      const skipConditions = validation(questionnaire);

      expect(skipConditions).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].skipConditions = [
        {
          id: "group-1",
          expressions: [
            {
              id: expressionId,
              condition: "Equal",
              left: {
                type: "Answer",
                answerId: "answer_1",
              },
              right: null,
            },
          ],
        },
      ];

      const skipConditionErrors = validation(questionnaire);

      expect(skipConditionErrors).toHaveLength(1);
      expect(skipConditionErrors[0].id).toMatch(uuidRejex);
      expect(skipConditionErrors[0].errorCode).toBe(ERR_RIGHTSIDE_NO_VALUE);
    });

    it("should validate empty right expression when condition=`CountOf` in skip", () => {
      const expressionId = "express-1";

      const skipConditions = validation(questionnaire);

      expect(skipConditions).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].skipConditions = [
        {
          id: "group-1",
          expressions: [
            {
              id: expressionId,
              condition: "CountOf",
              secondaryCondition: "Equal",
              left: {
                type: "Answer",
                answerId: "answer_1",
              },
              right: null,
            },
          ],
        },
      ];

      const skipConditionErrors = validation(questionnaire);

      expect(skipConditionErrors).toHaveLength(1);
      expect(skipConditionErrors[0].id).toMatch(uuidRejex);
      expect(skipConditionErrors[0].errorCode).toBe(ERR_RIGHTSIDE_NO_VALUE);
    });

    it("should validate that the count number does not exceed the number of options in Skip", () => {
      expect(validation(questionnaire)).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].answers[0] = {
        id: "answer_1",
        qCode: "qcode1",
        label: "answer_1",
        secondaryQCode: "secQCode1",
        options: [
          {
            id: "optionID-1",
            label: "checkbox 1",
          },
        ],
      };

      questionnaire.sections[0].folders[0].pages[0].skipConditions = [
        {
          id: "group-1",
          expressions: [
            {
              id: "express-1",
              condition: "CountOf",
              secondaryCondition: "Equal",
              left: {
                type: "Checkbox",
                answerId: "answer_1",
              },
              right: {
                type: "Custom",
                customValue: {
                  number: 2,
                },
              },
            },
          ],
        },
      ];

      const routingErrors = validation(questionnaire);

      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].errorCode).toBe(
        ERR_COUNT_OF_GREATER_THAN_AVAILABLE_OPTIONS
      );
    });

    it("If secondary condition = `GreaterThan` then count number must be LESS than number of options in Skip", () => {
      expect(validation(questionnaire)).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].answers[0] = {
        id: "answer_1",
        qCode: "qcode1",
        label: "answer_1",
        secondaryQCode: "secQCode1",
        options: [
          {
            id: "optionID-1",
            label: "checkbox 1",
          },
          {
            id: "optionID-2",
            label: "checkbox 2",
          },
        ],
      };

      questionnaire.sections[0].folders[0].pages[0].skipConditions = [
        {
          id: "group-1",
          expressions: [
            {
              id: "express-1",
              condition: "CountOf",
              secondaryCondition: "GreaterThan",
              left: {
                type: "Checkbox",
                answerId: "answer_1",
              },
              right: {
                type: "Custom",
                customValue: {
                  number: 2,
                },
              },
            },
          ],
        },
      ];

      const routingErrors = validation(questionnaire);

      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].errorCode).toBe(
        ERR_COUNT_OF_GREATER_THAN_AVAILABLE_OPTIONS
      );
    });

    it("should validate empty secondaryCondition when condition=`CountOf` in routing", () => {
      questionnaire.sections[0].folders[0].pages[0].routing = defaultRouting;

      questionnaire.sections[0].folders[0].pages[0].routing.rules[0].expressionGroup =
        {
          id: "group-1",
          expressions: [
            {
              id: "express-1",
              condition: "CountOf",
              secondaryCondition: null,
              left: {
                type: "Answer",
                answerId: "answer_1",
              },
            },
          ],
        };
      const routingErrors = validation(questionnaire);
      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].errorCode).toBe(ERR_SEC_CONDITION_NOT_SELECTED);
    });

    it("should validate empty right expression when condition=`CountOf` in routing", () => {
      expect(validation(questionnaire)).toHaveLength(0);
      questionnaire.sections[0].folders[0].pages[0].routing = defaultRouting;

      questionnaire.sections[0].folders[0].pages[0].routing.rules[0].expressionGroup =
        {
          id: "group-1",
          expressions: [
            {
              id: "express-1",
              condition: "CountOf",
              secondaryCondition: "Equal",
              left: {
                type: "Answer",
                answerId: "answer_1",
              },
              right: null,
            },
          ],
        };
      const routingErrors = validation(questionnaire);

      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].errorCode).toBe(ERR_RIGHTSIDE_NO_VALUE);
    });

    it("should validate that the count number does not exceed the number of options in the answer being routed", () => {
      expect(validation(questionnaire)).toHaveLength(0);
      questionnaire.sections[0].folders[0].pages[0].routing = defaultRouting;
      questionnaire.sections[0].folders[0].pages[0].answers[0] = {
        id: "answer_1",
        qCode: "qcode1",
        label: "answer_1",
        secondaryQCode: "secQCode1",
        options: [
          {
            id: "optionID-1",
            label: "checkbox 1",
          },
        ],
      };
      questionnaire.sections[0].folders[0].pages[0].routing.rules[0].expressionGroup =
        {
          id: "group-1",
          expressions: [
            {
              id: "express-1",
              condition: "CountOf",
              secondaryCondition: "Equal",
              left: {
                type: "Checkbox",
                answerId: "answer_1",
              },
              right: {
                type: "Custom",
                customValue: {
                  number: 2,
                },
              },
            },
          ],
        };
      const routingErrors = validation(questionnaire);

      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].errorCode).toBe(
        ERR_COUNT_OF_GREATER_THAN_AVAILABLE_OPTIONS
      );
    });

    it("If secondary condition = `GreaterThan` then count number must be LESS than number of options in the answer being routed", () => {
      expect(validation(questionnaire)).toHaveLength(0);
      questionnaire.sections[0].folders[0].pages[0].routing = defaultRouting;
      questionnaire.sections[0].folders[0].pages[0].answers[0] = {
        id: "answer_1",
        qCode: "qcode1",
        label: "answer_1",
        secondaryQCode: "secQCode1",
        options: [
          {
            id: "optionID-1",
            label: "checkbox 1",
          },
          {
            id: "optionID-2",
            label: "checkbox 2",
          },
        ],
      };
      questionnaire.sections[0].folders[0].pages[0].routing.rules[0].expressionGroup =
        {
          id: "group-1",
          expressions: [
            {
              id: "express-1",
              condition: "CountOf",
              secondaryCondition: "GreaterThan",
              left: {
                type: "Checkbox",
                answerId: "answer_1",
                options: [
                  {
                    id: "optionID-1",
                    label: "checkbox 1",
                  },
                  {
                    id: "optionID-2",
                    label: "checkbox 2",
                  },
                ],
              },
              right: {
                type: "Custom",
                customValue: {
                  number: 2,
                },
              },
            },
          ],
        };
      const routingErrors = validation(questionnaire);

      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].errorCode).toBe(
        ERR_COUNT_OF_GREATER_THAN_AVAILABLE_OPTIONS
      );
    });

    it("should validate empty array in right of expression", () => {
      const expressionId = "express-1";

      const skipConditions = validation(questionnaire);

      expect(skipConditions).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].skipConditions = [
        {
          id: "group-1",
          expressions: [
            {
              id: expressionId,
              condition: "Equal",
              left: {
                type: "Answer",
                answerId: "answer_1",
              },
              right: { options: [] },
            },
          ],
        },
      ];

      const skipConditionErrors = validation(questionnaire);

      expect(skipConditionErrors).toHaveLength(1);
      expect(skipConditionErrors[0].id).toMatch(uuidRejex);
      expect(skipConditionErrors[0].errorCode).toBe(ERR_RIGHTSIDE_NO_VALUE);
    });

    it("should validate exclusive or checkbox with and condition", () => {
      const expressionId = "express-1";

      questionnaire.sections[0].folders[0].pages[0].answers[0] = {
        id: "answer_1",
        qCode: "qcode1",
        label: "answer_1",
        secondaryQCode: "secQCode1",
        options: [
          {
            id: "option-1",
            label: "a",
            qCode: "qcode1",
          },
          {
            id: "option-2",
            label: "b",
            qCode: "qcode2",
          },
          {
            id: "option-3",
            label: "or",
            mutuallyExclusive: true,
            qCode: "qcode3",
          },
        ],
      };

      defaultRouting.rules[0].expressionGroup = {
        id: "group-1",
        operator: "Or",
        expressions: [
          {
            id: expressionId,
            condition: "AllOf",
            left: {
              type: "Answer",
              answerId: "answer_12",
            },
            right: {
              type: "SelectedOptions",
              optionIds: ["option-1", "option-3"],
            },
          },
        ],
      };

      questionnaire.sections[0].folders[0].pages[0].routing = defaultRouting;
      const routingErrors = validation(questionnaire);

      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].id).toMatch(uuidRejex);
      expect(routingErrors[0].errorCode).toBe(
        ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE
      );
    });

    it("should validate exclusive or checkbox with allof operator second scenario", () => {
      const expressionId = "express-1";
      const expressionId2 = "express-2";

      const routing = validation(questionnaire);

      expect(routing).toHaveLength(0);
      questionnaire.sections[0].folders[0].pages[0].answers[0] = {
        id: "answer_12",
        qCode: "qcode1",
        label: "answer_12",
        secondaryQCode: "secQCode1",
        options: [
          {
            id: "option-1",
            label: "a",
            qCode: "qcode1",
          },
          {
            id: "option-2",
            label: "b",
            qCode: "qcode2",
          },
          {
            id: "option-3",
            label: "or",
            mutuallyExclusive: true,
            qCode: "qcode3",
          },
        ],
      };

      questionnaire.sections[0].folders[0].pages[0].routing = {
        id: "1",
        else: {
          id: "else-1",
          logical: "NextPage",
        },
        rules: [
          {
            id: "rule-1",
            destination: {
              id: "dest-1",
              logical: "NextPage",
            },
            expressionGroup: {
              id: "group-1",
              operator: "And",
              expressions: [
                {
                  id: expressionId,
                  condition: "AllOf",
                  left: {
                    type: "Answer",
                    answerId: "answer_12",
                  },
                  right: {
                    type: "SelectedOptions",
                    optionIds: ["option-1"],
                  },
                },
                {
                  id: expressionId2,
                  condition: "AllOf",
                  left: {
                    type: "Answer",
                    answerId: "answer_12",
                  },
                  right: {
                    type: "SelectedOptions",
                    optionIds: ["option-3"],
                  },
                },
              ],
            },
          },
        ],
      };

      const routingErrors = validation(questionnaire);

      expect(routingErrors).toHaveLength(2);
      expect(routingErrors[0].id).toMatch(uuidRejex);
      expect(routingErrors[0].errorCode).toBe(
        ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND
      );
    });

    it("should return an error if a routing destination has not been specified", () => {
      questionnaire.sections[0].folders[0].pages[0].routing = {
        ...defaultRouting,
        rules: [
          {
            ...defaultRouting.rules[0],
            destination: {
              id: "destination_1",
            },
          },
        ],
      };

      const destinationMissingErrors = validation(questionnaire).filter(
        ({ errorCode }) => errorCode === ERR_DESTINATION_REQUIRED
      );
      expect(destinationMissingErrors).toHaveLength(1);
    });

    it("Should return an error when the hub is enabled and the destination is EndOfQuestionnaire", () => {
      questionnaire.sections[0].folders[0].pages[0].routing = {
        ...defaultRouting,
        rules: [
          {
            ...defaultRouting.rules[0],
            destination: {
              id: "destination_1",
              logical: "EndOfQuestionnaire",
            },
          },
        ],
      };

      questionnaire.hub = true;

      const destinationMissingErrors = validation(questionnaire).filter(
        ({ errorCode }) => errorCode === ERR_DESTINATION_INVALID_WITH_HUB
      );

      expect(destinationMissingErrors).toHaveLength(1);
    });

    it("Should return an error when the hub is enabled and the destination is a later section", () => {
      questionnaire.sections[0].folders[0].pages[0].routing = {
        ...defaultRouting,
        rules: [
          {
            ...defaultRouting.rules[0],
            destination: {
              id: "destination_1",
              sectionId: "section_1",
            },
          },
        ],
      };

      questionnaire.hub = true;

      const destinationMissingErrors = validation(questionnaire).filter(
        ({ errorCode }) => errorCode === ERR_DESTINATION_INVALID_WITH_HUB
      );

      expect(destinationMissingErrors).toHaveLength(1);
    });

    it("should return an error if a routing destination has been deleted", () => {
      questionnaire.sections[0].folders[0].pages[0].routing = {
        ...defaultRouting,
        else: {
          id: "else_1",
          pageId: "i-dont-exist",
        },
        rules: [
          {
            ...defaultRouting.rules[0],
            destination: {
              id: "destination_1",
              pageId: "i-dont-exist",
            },
          },
        ],
      };

      const destinationDeletedErrors = validation(questionnaire).filter(
        ({ errorCode }) => errorCode === ERR_DESTINATION_DELETED
      );
      expect(destinationDeletedErrors).toHaveLength(2);
    });

    it("should return an error if the destination has been moved before the routing page", () => {
      questionnaire.sections[0].folders[0].pages[1].routing = {
        id: "routing_1",
        else: {
          id: "else_1",
          logical: NEXT_PAGE,
        },
        rules: [
          {
            id: "rule_1",
            destination: {
              id: "destination_1",
              pageId: "page_1",
            },
            expressionGroup: {
              id: "expressionGroup_1",
              operator: AND,
              expressions: [
                {
                  id: "expression_1",
                  condition: GREATER_THAN,
                  left: {
                    type: ANSWER,
                    answerId: "answer_1",
                  },
                  right: {
                    type: CUSTOM,
                    customValue: {
                      number: 5,
                    },
                  },
                },
              ],
            },
          },
        ],
      };

      questionnaire.updatedAt = new Date();

      const validationErrors = validation(questionnaire);

      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0]).toMatchObject({
        id: uuidRejex,
        type: "routing",
        field: "destination",
        errorCode: ERR_DESTINATION_MOVED,
      });
    });

    describe("Validating AND in routing rules", () => {
      beforeEach(() => {
        questionnaire.sections[0].folders[0].pages[1].routing = {
          id: "1",
          else: {
            id: "else-1",
            logical: "NextPage",
          },
          rules: [
            {
              id: "rule-1",
              destination: {
                id: "dest-1",
                logical: "NextPage",
              },
              expressionGroup: {
                id: "group-1",
                operator: "And",
                expressions: [
                  {
                    id: "expression_1",
                    condition: "Equal",
                    left: {
                      answerId: "answer_1",
                    },
                    right: {
                      type: CUSTOM,
                      customValue: {
                        number: 42,
                      },
                    },
                  },
                ],
              },
            },
          ],
        };
      });

      it("should allow multiple compatible Equals expressions", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "Equal", number: 42 });

        expect(validation(questionnaire)).toHaveLength(0);
      });

      it("should reject multiple conflicting Equals expressions", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "Equal", number: 43 });

        const errors = validation(questionnaire);
        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(ERR_LOGICAL_AND);
      });

      it("should reject non-equality conditions which conflict with equality conditions", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "NotEqual", number: 42 });

        const errors = validation(questionnaire);
        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(ERR_LOGICAL_AND);
      });

      it("should allow valid less than / greater than ranges", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "LessThan", number: 44 });
        questionnaire.sections[0].folders[0].pages[1].routing.rules[0].expressionGroup.expressions[0].condition =
          "GreaterThan";

        expect(validation(questionnaire)).toHaveLength(0);
      });

      it("should reject more than value > less than value", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "LessThan", number: 40 });
        questionnaire.sections[0].folders[0].pages[1].routing.rules[0].expressionGroup.expressions[0].condition =
          "GreaterThan";

        const errors = validation(questionnaire);
        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(ERR_LOGICAL_AND);
      });

      it("should disallow empty numerical ranges", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "LessThan", number: 43 });
        questionnaire.sections[0].folders[0].pages[1].routing.rules[0].expressionGroup.expressions[0].condition =
          "GreaterThan";

        const errors = validation(questionnaire);
        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(ERR_LOGICAL_AND);
      });

      it("should allow narrow ranges given compatible answer precision", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "LessThan", number: 43 });
        questionnaire.sections[0].folders[0].pages[1].routing.rules[0].expressionGroup.expressions[0].condition =
          "GreaterThan";
        questionnaire.sections[0].folders[0].pages[0].answers[0].properties.decimals = 1;

        expect(validation(questionnaire)).toHaveLength(0);
      });

      it("should allow equality conditions which fall within range", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "LessThan", number: 44 });
        questionnaire.sections[0].folders[0].pages[1].routing.rules[0].expressionGroup.expressions[0].condition =
          "GreaterThan";
        addExpression({ questionnaire, condition: "Equal", number: 43 });

        expect(validation(questionnaire)).toHaveLength(0);
      });

      it("should reject equality conditions which fall outside of range", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "LessThan", number: 44 });
        questionnaire.sections[0].folders[0].pages[1].routing.rules[0].expressionGroup.expressions[0].condition =
          "GreaterThan";
        addExpression({ questionnaire, condition: "Equal", number: 40 });

        const errors = validation(questionnaire);
        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(ERR_LOGICAL_AND);
      });

      it("should reject non-equality conditions which completely deplete range", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "LessOrEqual", number: 43 });
        questionnaire.sections[0].folders[0].pages[1].routing.rules[0].expressionGroup.expressions[0].condition =
          "GreaterOrEqual";
        addExpression({ questionnaire, condition: "NotEqual", number: 42 });
        addExpression({ questionnaire, condition: "NotEqual", number: 43 });

        const errors = validation(questionnaire);
        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(ERR_LOGICAL_AND);
      });

      it("should reject expression groups combining Unanswered with any other type", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "Unanswered" });

        const errors = validation(questionnaire);
        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(ERR_LOGICAL_AND);
      });

      it("shouldn't throw AND validation errors prematurely when right side not entered yet", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        addExpression({ questionnaire, condition: "GreaterThan" });
        questionnaire.sections[0].folders[0].pages[1].routing.rules[0].expressionGroup.expressions[1].right =
          null;

        const errors = validation(questionnaire);
        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).not.toBe(ERR_LOGICAL_AND);
      });

      it("should run logical AND rules validation code also for skipConditions", () => {
        expect(validation(questionnaire)).toHaveLength(0);

        questionnaire.sections[0].folders[0].pages[1].skipConditions = [
          {
            id: "group-1",
            expressions: [
              {
                id: "skip-1",
                condition: "Equal",
                left: {
                  answerId: "answer_1",
                },
                right: {
                  type: CUSTOM,
                  customValue: {
                    number: 42,
                  },
                },
              },
              {
                id: "skip-2",
                condition: "Equal",
                left: {
                  answerId: "answer_1",
                },
                right: {
                  type: CUSTOM,
                  customValue: {
                    number: 43,
                  },
                },
              },
            ],
          },
        ];

        const errors = validation(questionnaire);
        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(ERR_LOGICAL_AND);
      });
    });
  });

  describe("Piping validation within Question Labels", () => {
    it("Should validate a deleted piped metadata in a title", () => {
      const piping = validation(questionnaire);
      expect(piping).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].title = `<p><span data-piped="metadata" data-id="metadata_1" data-type="Text">[Some metadata]</span></p>>`;

      const errors = validation(questionnaire);
      expect(errors).toHaveLength(1);
      expect(errors[0].errorCode).toBe(PIPING_METADATA_DELETED);
    });

    it("Should not return piping metadata error when piped metadata is in a title", () => {
      const piping = validation(questionnaire);
      expect(piping).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].title = `<p><span data-piped="metadata" data-id="87c64b20-9662-408b-b674-e2403e90dad3" data-type="Text">[Ru Name]</span></p>>`;

      const errors = validation(questionnaire);
      expect(errors).toHaveLength(0);
    });

    it("should validate a piping answer moved after this question", () => {
      const piping = validation(questionnaire);
      expect(piping).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].title = `<p><span data-piped="answers" data-id="answer_2" data-type="Number">[number]</span></p>`;

      const errors = validation(questionnaire);
      expect(errors).toHaveLength(1);
      expect(errors[0].errorCode).toBe(PIPING_TITLE_MOVED);
    });

    it("should validate a deleted piping answer in title", () => {
      const piping = validation(questionnaire);
      expect(piping).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].title = `<p><span data-piped="answers" data-id="answer_99" data-type="Number">[number]</span></p>`;

      const errors = validation(questionnaire);
      expect(errors).toHaveLength(1);
      expect(errors[0].errorCode).toBe(PIPING_TITLE_DELETED);
    });

    it("should validate a deleted piping variable in title", () => {
      const piping = validation(questionnaire);
      expect(piping).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].title = `<p><span data-piped="variable" data-id="answer_99" data-type="Number">[number]</span></p>`;

      const errors = validation(questionnaire);
      expect(errors).toHaveLength(1);
      expect(errors[0].errorCode).toBe(PIPING_TITLE_DELETED);
    });

    it("should not return errors for calculated summary variable in its own title", () => {
      const piping = validation(questionnaire);
      expect(piping).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[0].title = `<p><span data-piped="variable" data-id="total" data-type="Number">[number]</span></p>`;

      const errors = validation(questionnaire);
      expect(errors).toHaveLength(0);
    });

    it("should not return errors for valid piping answers in title", () => {
      const piping = validation(questionnaire);
      expect(piping).toHaveLength(0);

      questionnaire.sections[0].folders[0].pages[1].title = `<p><span data-piped="answers" data-id="answer_1" data-type="Number">[number]</span></p>`;

      const errors = validation(questionnaire);
      expect(errors).toHaveLength(0);
    });

    it("should not return errors when piping valid date range answers in title", () => {
      questionnaire.updatedAt = new Date();
      questionnaire.sections[0].folders[0].pages[0].answers[0] = {
        id: "daterange_1",
        type: DATE_RANGE,
        label: "Date from",
        secondaryLabel: "Date to",
      };

      questionnaire.sections[0].folders[0].pages[1].title = `<p><span data-piped="answers" data-id="daterange_1from" data-type="Date">[Date from]</span></p>
         <p><span data-piped="answers" data-id="daterange_1to" data-type="Date">[Date to]</span></p>`;

      const errors = validation(questionnaire);
      expect(errors).toHaveLength(0);
    });
  });

  describe("totalValidation", () => {
    const validateTotalValidation = (attributes) => {
      questionnaire.sections[0].folders[0].pages[1].totalValidation = {
        id: "totalvalidation-rule-1",
        enabled: true,
        entityType:
          attributes.previousAnswer !== undefined ? "PreviousAnswer" : "Custom",
        condition: "Equal",
        ...attributes,
      };
      questionnaire.updatedAt = new Date();
      return validation(questionnaire);
    };

    describe("using a custom numerical value", () => {
      it("should not return an error for a valid rule", () => {
        const errors = validateTotalValidation({
          custom: 42,
        });
        expect(errors.length).toBe(0);
      });

      it("should return an error when custom value not set", () => {
        const errors = validateTotalValidation({
          custom: null,
        });
        expect(errors.length).toBe(1);
        expect(errors[0].errorCode).toBe(ERR_NO_VALUE);
      });
    });

    describe("using a reference to previous answer", () => {
      it("should not return an error for a valid rule", () => {
        const errors = validateTotalValidation({
          previousAnswer: "answer_1",
        });
        expect(errors.length).toBe(0);
      });

      it("should return an error when previous answer reference not set", () => {
        const errors = validateTotalValidation({
          previousAnswer: null,
        });
        expect(errors.length).toBe(1);
        expect(errors[0].errorCode).toBe(ERR_NO_VALUE);
      });

      it("should return an error when previous answer reference doesn't exist", () => {
        const errors = validateTotalValidation({
          previousAnswer: "i-dont-exist-anymore",
        });
        expect(errors.length).toBe(1);
        expect(errors[0].errorCode).toBe(ERR_REFERENCE_DELETED);
      });

      it("should return an error when previous answer reference comes after current question", () => {
        questionnaire.sections[0].folders[0].pages.push({
          id: "page_3",
          title: "Dummy moved page",
          answers: [
            {
              id: "answer_3",
              type: NUMBER,
              label: "Number",
              qCode: "qCode5",
            },
          ],
        });

        const errors = validateTotalValidation({
          previousAnswer: "answer_3",
        });

        expect(errors.length).toBe(1);
        expect(errors[0].errorCode).toBe(ERR_REFERENCE_MOVED);
      });
    });
  });

  describe("Calculated summary validation", () => {
    let mockCalcSum;

    beforeEach(() => {
      mockCalcSum = {
        id: "page_3",
        title: "A calculated summary",
        pageType: "CalculatedSummaryPage",
        summaryAnswers: [],
        alias: null,
        totalTitle: "Test",
      };
    });

    describe("Outside a folder", () => {
      it("Should validate when the calculated summary appears before the answers it uses", () => {
        const pages = questionnaire.sections[0].folders[0].pages;

        mockCalcSum.summaryAnswers = [
          pages[0].answers[0].id,
          pages[1].answers[0].id,
        ];

        const rearrangedFolders = [
          { id: "folder_1", pages: [{ ...mockCalcSum }] },
          { id: "folder_2", pages: [{ ...pages[0] }] },
          { id: "folder_3", pages: [{ ...pages[1] }] },
        ];

        questionnaire.sections[0].folders = rearrangedFolders;
        questionnaire.id = 1;
        const errors = validation(questionnaire);

        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(CALCSUM_MOVED);
      });

      it("Should validate when the calculated summary total title is empty", () => {
        const pages = questionnaire.sections[0].folders[0].pages;

        mockCalcSum.summaryAnswers = [
          pages[0].answers[0].id,
          pages[1].answers[0].id,
        ];

        mockCalcSum.totalTitle = "";

        const rearrangedFolders = [
          { id: "folder_1", pages: [{ ...pages[0] }] },
          { id: "folder_2", pages: [{ ...pages[1] }] },
          { id: "folder_3", pages: [{ ...mockCalcSum }] },
        ];

        questionnaire.sections[0].folders = rearrangedFolders;
        questionnaire.id = 2;
        const errors = validation(questionnaire);

        expect(errors).toHaveLength(1);
      });

      it("Should not validate when the calc sum appears after the answers it uses", () => {
        const pages = questionnaire.sections[0].folders[0].pages;

        mockCalcSum.summaryAnswers = [
          pages[0].answers[0].id,
          pages[1].answers[0].id,
        ];

        const rearrangedFolders = [
          { id: "folder_1", pages: [{ ...pages[0] }] },
          { id: "folder_2", pages: [{ ...pages[1] }] },
          { id: "folder_3", pages: [{ ...mockCalcSum }] },
        ];

        questionnaire.sections[0].folders = rearrangedFolders;
        questionnaire.id = 2;
        const errors = validation(questionnaire);

        expect(errors).toHaveLength(0);
      });
    });

    describe("Inside a folder", () => {
      it("Should validate when the calculated summary appears before the answers it uses", () => {
        const pages = questionnaire.sections[0].folders[0].pages;
        mockCalcSum.summaryAnswers = [
          pages[0].answers[0].id,
          pages[1].answers[0].id,
        ];

        const rearrangedFolders = [
          {
            id: "folder_1",
            pages: [{ ...mockCalcSum }, { ...pages[0] }, { ...pages[1] }],
          },
        ];

        questionnaire.sections[0].folders = rearrangedFolders;
        questionnaire.id = 3;
        const errors = validation(questionnaire);

        expect(errors).toHaveLength(1);
        expect(errors[0].errorCode).toBe(CALCSUM_MOVED);
      });

      it("Should not validate when the calc sum appears after the answers it uses", () => {
        const pages = questionnaire.sections[0].folders[0].pages;

        mockCalcSum.summaryAnswers = [
          pages[0].answers[0].id,
          pages[1].answers[0].id,
        ];

        const rearrangedFolders = [
          {
            id: "folder_1",
            pages: [{ ...pages[0] }, { ...pages[1] }, { ...mockCalcSum }],
          },
        ];

        questionnaire.sections[0].folders = rearrangedFolders;
        questionnaire.id = 4;
        const errors = validation(questionnaire);

        expect(errors).toHaveLength(0);
      });
    });
  });
});
