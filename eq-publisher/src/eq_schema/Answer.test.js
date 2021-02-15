const {
  NUMBER,
  DATE,
  CHECKBOX,
  RADIO,
  TEXTFIELD,
  CURRENCY,
  PERCENTAGE,
  UNIT,
  DURATION,
  TEXTAREA,
} = require("../constants/answerTypes");
const Answer = require("./Answer");
const Question = require("./Question");

const { CENTIMETER, unitConversion } = require("../constants/unit-types");

describe("Answer", () => {
  const createAnswerJSON = (answer) =>
    Object.assign(
      {
        id: 1,
        description: "This is a description",
        guidance: null,
        qCode: "51",
        label: "Number of male employees working more than 30 hours per week",
        type: NUMBER,
        properties: {
          required: true,
          decimals: 2,
        },
      },
      answer
    );

  it("should generate a valid eQ answer from an author answer", () => {
    const answer = new Answer(createAnswerJSON({ type: NUMBER }));

    expect(answer).toMatchObject({
      id: "answer1",
      type: NUMBER,
      mandatory: true,
      decimal_places: 2,
      description: "This is a description",
    });
  });

  it("should set currency to GBP for currency types", () => {
    const answer = new Answer(createAnswerJSON({ type: CURRENCY }));
    expect(answer.currency).toBe("GBP");
  });

  it("should correctly define a unit answer", () => {
    const authorAnswer = createAnswerJSON({ type: UNIT });
    authorAnswer.properties.unit = CENTIMETER;
    const answer = new Answer(createAnswerJSON({ type: UNIT }));
    expect(answer.unit).toBe(unitConversion[CENTIMETER]);
  });

  it("should correctly define a months years duration answer", () => {
    const authorAnswer = createAnswerJSON({ type: DURATION });
    authorAnswer.properties.unit = "YearsMonths";
    const answer = new Answer(authorAnswer);
    expect(answer.units).toEqual(["years", "months"]);
  });

  it("should correctly define a  years duration answer", () => {
    const authorAnswer = createAnswerJSON({ type: DURATION });
    authorAnswer.properties.unit = "Years";
    const answer = new Answer(authorAnswer);
    expect(answer.units).toEqual(["years"]);
  });

  it("should correctly define a months duration answer", () => {
    const authorAnswer = createAnswerJSON({ type: DURATION });
    authorAnswer.properties.unit = "Months";
    const answer = new Answer(authorAnswer);
    expect(answer.units).toEqual(["months"]);
  });

  it("should set correct to answer type for different date formats", () => {
    const date = new Answer(
      createAnswerJSON({
        type: DATE,
        properties: {
          format: "dd/mm/yyyy",
        },
      })
    );
    expect(date.type).toBe(DATE);

    const monthYearDate = new Answer(
      createAnswerJSON({
        type: DATE,
        properties: {
          format: "mm/yyyy",
        },
      })
    );
    expect(monthYearDate.type).toBe("MonthYearDate");

    const yearDate = new Answer(
      createAnswerJSON({
        type: DATE,
        properties: {
          format: "yyyy",
        },
      })
    );
    expect(yearDate.type).toBe("YearDate");
  });

  it("should set maxLength property for textarea types", () => {
    const answer = new Answer(
      createAnswerJSON({
        type: TEXTAREA,
        properties: {
          maxLength: "64",
        },
      })
    );

    expect(answer.max_length).toBe(64);
  });

  describe("validation", () => {
    it("should not add validation if undefined", () => {
      const answer = new Answer(
        createAnswerJSON({
          validation: null,
        })
      );
      expect(answer.validation).toBeUndefined();
    });

    it("should drop validations with unknown entityTypes", () => {
      const answer = new Answer(
        createAnswerJSON({
          validation: {
            minValue: {
              id: "2",
              enabled: false,
            },
            maxValue: {
              id: "1",
              inclusive: false,
              enabled: true,
              custom: 5,
              entityType: "Typefoo",
            },
          },
        })
      );
      expect(answer.max_value).toBeUndefined();
    });

    describe("Min value", () => {
      it("should add a min value validation rule for number types", () => {
        [NUMBER, PERCENTAGE, CURRENCY].forEach((type) => {
          const answer = new Answer(
            createAnswerJSON({
              type,
              validation: {
                minValue: {
                  id: "2",
                  enabled: true,
                  inclusive: false,
                  custom: 0,
                },
                maxValue: {
                  id: "1",
                  enabled: false,
                },
              },
            })
          );
          expect(answer.min_value).toMatchObject({
            value: 0,
            exclusive: true,
          });
        });
      });
    });

    describe("Max value", () => {
      it("should add a max value validation rule for number types", () => {
        [NUMBER, PERCENTAGE, CURRENCY].forEach((type) => {
          const answer = new Answer(
            createAnswerJSON({
              type,
              validation: {
                minValue: {
                  id: "2",
                  enabled: false,
                },
                maxValue: {
                  id: "1",
                  inclusive: false,
                  enabled: true,
                  custom: 5,
                },
              },
            })
          );
          expect(answer.max_value).toMatchObject({
            value: 5,
            exclusive: true,
          });
        });
      });

      it("should drop validation rule when no custom value and entityType is Custom", () => {
        const answer = new Answer(
          createAnswerJSON({
            validation: {
              minValue: {
                id: "2",
                enabled: false,
              },
              maxValue: {
                id: "1",
                inclusive: false,
                enabled: true,
                custom: null,
                entityType: "Custom",
              },
            },
          })
        );
        expect(answer.max_value).toBeUndefined();
      });

      it("should add a previous answer min validation when entityType is PreviousAnswer", () => {
        const answer = new Answer(
          createAnswerJSON({
            validation: {
              minValue: {
                id: "1",
                inclusive: true,
                enabled: true,
                entityType: "PreviousAnswer",
                previousAnswer: {
                  id: "3",
                },
              },
              maxValue: {
                id: "1",
                inclusive: true,
                enabled: false,
              },
            },
          })
        );
        expect(answer.min_value).toMatchObject({
          answer_id: "answer3",
        });
      });

      it("should add a previous answer max validation when entityType is PreviousAnswer", () => {
        const answer = new Answer(
          createAnswerJSON({
            validation: {
              minValue: {
                id: "2",
                enabled: false,
              },
              maxValue: {
                id: "1",
                inclusive: true,
                enabled: true,
                entityType: "PreviousAnswer",
                previousAnswer: {
                  id: "3",
                },
              },
            },
          })
        );
        expect(answer.max_value).toMatchObject({
          answer_id: "answer3",
        });
      });

      it("should drop max values that have an entity type of PreviousAnswer but no answer", () => {
        const answer = new Answer(
          createAnswerJSON({
            validation: {
              minValue: {
                id: "2",
                enabled: false,
              },
              maxValue: {
                id: "1",
                inclusive: true,
                enabled: true,
                entityType: "PreviousAnswer",
                previousAnswer: null,
              },
            },
          })
        );
        expect(answer.max_value).toBeUndefined();
      });
    });

    describe("Earliest date", () => {
      let authorDateAnswer;
      beforeEach(() => {
        authorDateAnswer = {
          type: DATE,
          validation: {
            earliestDate: {
              id: "1",
              enabled: true,
              custom: "2017-02-17",
              offset: {
                value: 4,
                unit: "Days",
              },
              relativePosition: "Before",
            },
            latestDate: {
              enabled: false,
            },
          },
        };
      });

      it("should add earliest date custom value", () => {
        authorDateAnswer.validation.earliestDate.custom = "2017-02-17";
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.minimum.value).toEqual("2017-02-17");
      });

      it("should add earliest date current date value", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              earliestDate: {
                id: "1",
                enabled: true,
                entityType: "Now",
                custom: null,
                offset: {
                  value: 4,
                  unit: "Days",
                },
                relativePosition: "Before",
              },
              latestDate: {
                enabled: false,
              },
            },
          })
        );
        expect(answer.minimum).toMatchObject({
          offset_by: { days: -4 },
          value: "now",
        });
      });

      it("should add earliest date previous answer", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              earliestDate: {
                id: "1",
                enabled: true,
                entityType: "PreviousAnswer",
                custom: null,
                previousAnswer: {
                  id: "3",
                },
                offset: {
                  value: 4,
                  unit: "Days",
                },
                relativePosition: "Before",
              },
              latestDate: {
                enabled: false,
              },
            },
          })
        );

        expect(answer.minimum).toMatchObject({
          answer_id: "answer3",
        });
      });

      it("should add earliest date metadata", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              earliestDate: {
                id: "1",
                enabled: true,
                entityType: "Metadata",
                custom: null,
                previousAnswer: null,
                metadata: {
                  key: "test_ref",
                },
                offset: {
                  value: 4,
                  unit: "Days",
                },
                relativePosition: "Before",
              },
              latestDate: {
                enabled: false,
              },
            },
          })
        );

        expect(answer.minimum).toMatchObject({
          meta: "test_ref",
        });
      });

      it("should drop validation that has an entity type of PreviousAnswer but no answer", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              earliestDate: {
                id: "1",
                enabled: true,
                entityType: "PreviousAnswer",
                custom: null,
                previousAnswer: null,
                offset: {
                  value: 4,
                  unit: "Days",
                },
                relativePosition: "Before",
              },
              latestDate: {
                enabled: false,
              },
            },
          })
        );
        expect(answer.minimum).toBeUndefined();
      });

      it("should drop validation that has an entity type of Metadata but no metadata", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              earliestDate: {
                id: "1",
                enabled: true,
                entityType: "Metadata",
                custom: null,
                previousAnswer: null,
                metadata: null,
                offset: {
                  value: 4,
                  unit: "Days",
                },
                relativePosition: "Before",
              },
              latestDate: {
                enabled: false,
              },
            },
          })
        );
        expect(answer.minimum).toBeUndefined();
      });

      it("should add a positive days offset", () => {
        authorDateAnswer.validation.earliestDate.relativePosition = "After";
        authorDateAnswer.validation.earliestDate.offset = {
          value: 4,
          unit: "Days",
        };
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.minimum.offset_by).toMatchObject({
          days: 4,
        });
      });

      it("should add a negative months offset", () => {
        authorDateAnswer.validation.earliestDate.relativePosition = "Before";
        authorDateAnswer.validation.earliestDate.offset = {
          value: 7,
          unit: "Months",
        };
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.minimum.offset_by).toMatchObject({
          months: -7,
        });
      });

      it("should not output the minimum validation if it is not enabled", () => {
        authorDateAnswer.validation.earliestDate.enabled = false;
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.minimum).toBeUndefined();
      });

      it("should not add the output if the custom date is not specified", () => {
        authorDateAnswer.validation.earliestDate.custom = null;
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.minimum).toBeUndefined();
      });
    });

    describe("Latest date", () => {
      let authorDateAnswer;
      beforeEach(() => {
        authorDateAnswer = {
          type: DATE,
          validation: {
            earliestDate: {
              enabled: false,
            },
            latestDate: {
              id: "1",
              enabled: true,
              custom: "2017-02-17",
              offset: {
                value: 4,
                unit: "Days",
              },
              relativePosition: "Before",
            },
          },
        };
      });

      it("should add latest date custom value", () => {
        authorDateAnswer.validation.latestDate.custom = "2017-02-17";
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.maximum.value).toEqual("2017-02-17");
      });

      it("should add latest date previous answer", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              latestDate: {
                id: "1",
                enabled: true,
                entityType: "PreviousAnswer",
                custom: null,
                previousAnswer: {
                  id: "3",
                },
                offset: {
                  value: 4,
                  unit: "Days",
                },
                relativePosition: "Before",
              },
              earliestDate: {
                enabled: false,
              },
            },
          })
        );

        expect(answer.maximum).toMatchObject({
          answer_id: "answer3",
        });
      });

      it("should add latest date current date value", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              earliestDate: {
                enabled: false,
              },
              latestDate: {
                id: "1",
                enabled: true,
                entityType: "Now",
                custom: null,
                offset: {
                  value: 3,
                  unit: "Years",
                },
                relativePosition: "After",
              },
            },
          })
        );
        expect(answer.maximum).toMatchObject({
          offset_by: { years: 3 },
          value: "now",
        });
      });

      it("should add latest date metadata", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              latestDate: {
                id: "1",
                enabled: true,
                entityType: "Metadata",
                custom: null,
                previousAnswer: null,
                metadata: {
                  key: "test_ref",
                },
                offset: {
                  value: 4,
                  unit: "Days",
                },
                relativePosition: "Before",
              },
              earliestDate: {
                enabled: false,
              },
            },
          })
        );

        expect(answer.maximum).toMatchObject({
          meta: "test_ref",
        });
      });

      it("should drop validation that has an entity type of PreviousAnswer but no answer", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              latestDate: {
                id: "1",
                enabled: true,
                entityType: "PreviousAnswer",
                custom: null,
                previousAnswer: null,
                offset: {
                  value: 4,
                  unit: "Days",
                },
                relativePosition: "Before",
              },
              earliestDate: {
                enabled: false,
              },
            },
          })
        );
        expect(answer.maximum).toBeUndefined();
      });

      it("should drop validation that has an entity type of Metadata but no metadata", () => {
        const answer = new Answer(
          createAnswerJSON({
            type: DATE,
            validation: {
              latestDate: {
                id: "1",
                enabled: true,
                entityType: "Metadata",
                custom: null,
                previousAnswer: null,
                metadata: null,
                offset: {
                  value: 4,
                  unit: "Days",
                },
                relativePosition: "Before",
              },
              earliestDate: {
                enabled: false,
              },
            },
          })
        );
        expect(answer.maximum).toBeUndefined();
      });

      it("should add a positive days offset", () => {
        authorDateAnswer.validation.latestDate.relativePosition = "After";
        authorDateAnswer.validation.latestDate.offset = {
          value: 4,
          unit: "Days",
        };
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.maximum.offset_by).toMatchObject({
          days: 4,
        });
      });

      it("should add a negative months offset", () => {
        authorDateAnswer.validation.latestDate.relativePosition = "Before";
        authorDateAnswer.validation.latestDate.offset = {
          value: 7,
          unit: "Months",
        };
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.maximum.offset_by).toMatchObject({
          months: -7,
        });
      });

      it("should not output the maximum validation if it is not enabled", () => {
        authorDateAnswer.validation.latestDate.enabled = false;
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.maximum).toBeUndefined();
      });

      it("should not add the output if the custom date is not specified", () => {
        authorDateAnswer.validation.latestDate.custom = null;
        const answer = new Answer(createAnswerJSON(authorDateAnswer));
        expect(answer.maximum).toBeUndefined();
      });
    });
  });

  describe("converting options", () => {
    it("should not add options for basic answer types", () => {
      const answer = new Answer(createAnswerJSON());
      expect(answer.options).toBeUndefined();
    });

    it("should add options for multiple choice answers", () => {
      const answer = new Answer(
        createAnswerJSON({
          type: RADIO,
          options: [
            {
              id: 1,
              label: "Option one",
              description: "A short description",
            },
            {
              id: 2,
              label: "Option two",
              description: "Another description",
            },
          ],
        })
      );

      expect(answer.options).toEqual([
        {
          label: "Option one",
          value: "Option one",
          description: "A short description",
        },
        {
          label: "Option two",
          value: "Option two",
          description: "Another description",
        },
      ]);
    });

    it("should omit child_answer_id if not supplied", () => {
      const answer = new Answer(
        createAnswerJSON({
          type: RADIO,
          options: [
            {
              id: 1,
              label: "Option one",
            },
            {
              id: 2,
              label: "Option two",
            },
          ],
        })
      );

      answer.options.forEach((option) => {
        expect(option).not.toHaveProperty("child_answer_id");
      });
    });

    it("should add options even if empty array", () => {
      const answer = new Answer(createAnswerJSON({ options: [] }));
      expect(answer.options).toEqual([]);
    });
  });

  it("should omit option description if null value provided", () => {
    const answer = new Answer(
      createAnswerJSON({
        type: RADIO,
        options: [
          {
            id: 1,
            label: "Option one",
            description: null,
          },
          {
            id: 2,
            label: "Option two",
            description: null,
          },
        ],
      })
    );

    expect(answer.options).toEqual([
      {
        label: "Option one",
        value: "Option one",
      },
      {
        label: "Option two",
        value: "Option two",
      },
    ]);
  });

  describe("creating checkbox/radio answers with additionalAnswers", () => {
    let checkboxWithAdditionalAnswers;
    let question;

    beforeEach(() => {
      checkboxWithAdditionalAnswers = createAnswerJSON({
        id: 1,
        type: CHECKBOX,
        options: [
          {
            id: 1,
            label: "One",
          },
          {
            id: 2,
            label: "Two",
          },
          {
            id: 3,
            label: "Three",
            additionalAnswer: {
              id: 4,
              label: "Additional",
              type: TEXTFIELD,
            },
          },
        ],
      });

      question = new Question(
        createAnswerJSON({
          answers: [checkboxWithAdditionalAnswers],
        })
      );
    });

    it("should 3 options one of which with a detail_answer field", () => {
      expect(question.answers[0].options).toHaveLength(3);
      expect(question.answers[0].options[2]).toEqual(
        expect.objectContaining({
          detail_answer: {
            id: "answer4",
            label: "Additional",
            type: TEXTFIELD,
            mandatory: true,
          },
        })
      );
    });
  });
});
