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

const { END_OF_QUESTIONNAIRE } = require("../../constants/logicalDestinations");

const { CUSTOM, ANSWER } = require("../../constants/validationEntityTypes");

const { AND } = require("../../constants/routingOperators");

const {
  ERR_MAX_LENGTH_TOO_LARGE,
  ERR_MAX_LENGTH_TOO_SMALL,
  ERR_ANSWER_NOT_SELECTED,
  ERR_RIGHTSIDE_NO_VALUE,
  ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE,
  ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND,
  ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
  ERR_DESTINATION_MOVED,
  ERR_DESTINATION_DELETED,
  PIPING_TITLE_DELETED,
  PIPING_TITLE_MOVED,
} = require("../../constants/validationErrorCodes");

const validation = require(".");

const uuidRejex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

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
    expect(validationPageErrors.length).toEqual(0);
  });

  describe("Question page validation", () => {
    it("should validate that a title is required", () => {
      const page = questionnaire.sections[0].pages[0];
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
      const page = questionnaire.sections[0].pages[0];
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
      const page = questionnaire.sections[0].pages[0];
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
      const page = questionnaire.sections[0].pages[0];
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
      const page = questionnaire.sections[0].pages[0];
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
      const page = questionnaire.sections[0].pages[0];
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
      const page = questionnaire.sections[0].pages[0];
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
      const page = questionnaire.sections[0].pages[0];
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
      const page = questionnaire.sections[0].pages[0];
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
      questionnaire.sections[0].pages[0].answers = [answer];

      const validationPageErrors = validation(questionnaire);
      expect(validationPageErrors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "label",
        id: uuidRejex,
        type: "option",
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

      it("should validate if qCode is missing", () => {
        const answer = {
          id: "a1",
          type: NUMBER,
          label: "some answer",
          qCode: "",
          secondaryQCode: "secQCode1",
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

        expect(pageErrors).toHaveLength(1);
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

        const validationPageErrors = validation(questionnaire);
        expect(validationPageErrors).toHaveLength(1);
        expect(validationPageErrors[0]).toMatchObject({
          errorCode: "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY",
          field: "decimals",
          id: uuidRejex,
          type: "answer",
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
          questionnaire.sections[0].pages[0].answers[0].properties.maxLength =
            "2001";
          const validationPageErrors = validation(questionnaire);
          const pageErrors = validationPageErrors;

          expect(pageErrors[0]).toMatchObject({
            errorCode: ERR_MAX_LENGTH_TOO_LARGE,
            field: "maxLength",
            id: uuidRejex,
            type: "answer",
          });
        });

        it("should validate if qCode is missing", () => {
          const answer = {
            id: "a1",
            type: "TextField",
            label: "some answer",
            qCode: "",
            secondaryQCode: "secQCode1",
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

          expect(pageErrors).toHaveLength(1);
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

          expect(pageErrors).toHaveLength(1);
          expect(pageErrors[0].errorCode).toEqual("ERR_EARLIEST_AFTER_LATEST");
        });

        it("should not return an error if one of the two is disabled", () => {
          ["earliestDate", "latestDate", "none"].forEach(entity => {
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

            questionnaire.sections[0].pages[0].answers = [answer];

            const pageErrors = validation(questionnaire);

            expect(pageErrors).toHaveLength(0);
          });
        });

        it("should validate if qCode is missing", () => {
          const answer = {
            id: "a1",
            type: DATE,
            label: "some answer",
            qCode: "",
            secondaryQCode: "secQCode1",
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

          expect(pageErrors).toHaveLength(1);
        });
      });

      describe("date range answers", () => {
        describe("Earliest date and latest date", () => {
          it("Date Range - should validate that latest date is always after earlier date", () => {
            questionnaire.sections[0].pages[0].answers = [answer];

            const pageErrors = validation(questionnaire);

            expect(pageErrors).toHaveLength(1);
            expect(pageErrors[0].errorCode).toEqual(
              "ERR_EARLIEST_AFTER_LATEST"
            );
          });

          it("Date Range - should not validate if one of the two is disabled", () => {
            ["earliestDate", "latestDate", "none"].forEach(entity => {
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

              questionnaire.sections[0].pages[0].answers = [answer];

              const pageErrors = validation(questionnaire);

              expect(pageErrors).toHaveLength(0);
            });
          });

          it("should validate if qCode is missing", () => {
            const answer = {
              id: "a1",
              type: DATE_RANGE,
              label: "some answer",
              qCode: "",
              secondaryQCode: "secQCode1",
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

            expect(pageErrors).toHaveLength(1);
          });

          it("should validate if secondaryQCode is missing", () => {
            const answer = {
              id: "a1",
              type: DATE_RANGE,
              label: "some answer",
              qCode: "",
              secondaryQCode: "secQCode1",
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

            expect(pageErrors).toHaveLength(1);
          });
        });
        describe("Min duration and max duration", () => {
          it("Date Range - should validate that latest date is always after earlier date", () => {
            questionnaire.sections[0].pages[0].answers = [
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

          it("Date Range - should not validate if one of the two is disabled", () => {
            ["earliestDate", "latestDate", "none"].forEach(() => {
              questionnaire.sections[0].pages[0].answers = [
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
        [CURRENCY, NUMBER, UNIT, PERCENTAGE].forEach(type => {
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
        ["minValue", "maxValue", "none"].forEach(entity => {
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

          expect(pageErrors).toHaveLength(0);
        });
      });

      it("should not validate if one of the two is a previous answer", () => {
        ["minValue", "maxValue", "none"].forEach(entity => {
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

          expect(pageErrors).toHaveLength(0);
        });
      });

      it("should validate if qCode is missing", () => {
        ["minValue", "maxValue", "none"].forEach(entity => {
          const answer = {
            id: "a1",
            type: NUMBER,
            label: "some answer",
            qCode: "",
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

          expect(pageErrors).toHaveLength(1);
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
    beforeEach(() => {
      questionnaire.sections[0].pages[0].routing = null;
      questionnaire.sections[0].pages[0].skipConditions = null;
    });
    it("should validate empty routing rules", () => {
      const expressionId = "express-1";

      const routing = validation(questionnaire);

      expect(routing.length).toBe(0);

      questionnaire.sections[0].pages[0].routing = {
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

      const routingErrors = validation(questionnaire);

      expect(routingErrors.length).toBe(1);
      expect(routingErrors[0].id).toMatch(uuidRejex);
      expect(routingErrors[0].errorCode).toBe(ERR_ANSWER_NOT_SELECTED);
    });

    it("should validate left hand Answer is after routing question", () => {
      const expressionId = "express-1";

      const routing = validation(questionnaire);

      expect(routing).toHaveLength(0);

      questionnaire.sections[0].pages[0].routing = {
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
                  condition: "Equal",
                  left: {
                    type: "Answer",
                    answerId: "answer_2",
                  },
                },
              ],
            },
          },
        ],
      };

      const routingErrors = validation(questionnaire);

      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].id).toMatch(uuidRejex);
      expect(routingErrors[0].errorCode).toBe(ERR_LEFTSIDE_NO_LONGER_AVAILABLE);
    });

    it("should validate empty skip conditions", () => {
      const expressionId = "express-1";

      const errors = validation(questionnaire);

      expect(errors).toHaveLength(0);

      questionnaire.sections[0].pages[0].skipConditions = [
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

      questionnaire.sections[0].pages[0].skipConditions = [
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

    it("should validate exclusive or checkbox with and condition", () => {
      const expressionId = "express-1";

      const routing = validation(questionnaire);

      expect(routing).toHaveLength(0);
      questionnaire.sections[0].pages[0].answers[0] = {
        id: "answer_1",
        qCode: "qcode1",
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

      questionnaire.sections[0].pages[0].routing = {
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
              operator: "OR",
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
            },
          },
        ],
      };

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
      questionnaire.sections[0].pages[0].answers[0] = {
        id: "answer_12",
        qCode: "qcode1",
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

      questionnaire.sections[0].pages[0].routing = {
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
                  condition: "AnyOf",
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
                  condition: "AnyOf",
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

      expect(routingErrors).toHaveLength(1);
      expect(routingErrors[0].id).toMatch(uuidRejex);
      expect(routingErrors[0].errorCode).toBe(
        ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND
      );
    });

    it("should return an error if a routing destination has been deleted", () => {
      questionnaire.sections[0].pages[0].routing = {
        id: "routing_1",
        else: {
          id: "else_1",
          logical: END_OF_QUESTIONNAIRE,
        },
        rules: [
          {
            id: "rule_1",
            destination: {
              id: "destination_1",
              pageId: null,
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

      const validationErrors = validation(questionnaire);

      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0]).toMatchObject({
        id: uuidRejex,
        type: "routing",
        field: "destination",
        errorCode: ERR_DESTINATION_DELETED,
      });
    });

    it("should return an error if the destination has been moved to an invalid location", () => {
      questionnaire.sections[0].pages[0].routing = {
        id: "routing_1",
        else: {
          id: "else_1",
          logical: END_OF_QUESTIONNAIRE,
        },
        rules: [
          {
            id: "rule_1",
            destination: {
              id: "destination_1",
              pageId: "page_4",
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

      questionnaire.sections.push({
        id: "section_2",
        title: "section_2",
        pages: [
          {
            id: "page_3",
            title: "page title",
            answers: [
              {
                id: "answer_3",
                type: NUMBER,
                label: "Number",
              },
            ],
            routing: null,
            skipConditions: null,
          },
          {
            id: "page_4",
            title: "page title",
            answers: [
              {
                id: "answer_4",
                type: NUMBER,
                label: "Number",
              },
            ],
            routing: null,
            skipConditions: null,
          },
        ],
      });

      const validationErrors = validation(questionnaire);

      expect(validationErrors[0]).toMatchObject({
        id: uuidRejex,
        type: "routing",
        field: "destination",
        errorCode: ERR_DESTINATION_MOVED,
      });
      expect(validationErrors).toHaveLength(1);
    });
  });

  describe("Piping validation within Question Labels", () => {
    it("should validate a piping answer moved after this question", () => {
      const piping = validation(questionnaire);
      expect(piping).toHaveLength(0);

      questionnaire.sections[0].pages[0].title = `<p><span data-piped="answers" data-id="answer_2" data-type="Number">[number]</span></p>`;

      const errors = validation(questionnaire);

      expect(errors).toHaveLength(1);
      expect(errors[0].errorCode).toBe(PIPING_TITLE_MOVED);
    });

    it("should validate a deleted piping answer in title", () => {
      const piping = validation(questionnaire);
      expect(piping).toHaveLength(0);

      questionnaire.sections[0].pages[0].title = `<p><span data-piped="answers" data-id="answer_99" data-type="Number">[number]</span></p>`;

      const errors = validation(questionnaire);
      expect(errors).toHaveLength(1);
      expect(errors[0].errorCode).toBe(PIPING_TITLE_DELETED);
    });
  });
});
