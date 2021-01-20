const Question = require("./Question");
const Answer = require("./Answer");
const { omit, set, last } = require("lodash/fp");
const { DATE, DATE_RANGE, NUMBER } = require("../constants/answerTypes");

describe("Question", () => {
  const createQuestionJSON = options =>
    Object.assign(
      {
        id: 1,
        title: "question title",
        description: "question description",
        type: "General",
        answers: [
          {
            id: "1",
            properties: {
              required: true,
            },
          },
        ],
      },
      options
    );

  it("should construct a valid eQ runner question from an author question", () => {
    const question = new Question(createQuestionJSON());

    expect(question).toMatchObject({
      id: "question1",
      title: "question title",
      type: "General",
      answers: [expect.any(Answer)],
    });
  });

  it("should handle HTML values", () => {
    const question = new Question(
      createQuestionJSON({
        title: "<p>question title</p>",
      })
    );

    expect(question).toMatchObject({
      title: "question title",
    });
  });

  describe("description", () => {
    describe("when there is content and enabled", () => {
      it("should be populated", () => {
        const question = new Question(
          createQuestionJSON({
            description: "<h2>hello world</h2>",
            descriptionEnabled: true,
          })
        );
        expect(question.description).toBeDefined();
      });
    });

    describe("when it is disabled", () => {
      it("should be undefined", () => {
        const question = new Question(
          createQuestionJSON({ descriptionEnabled: false })
        );
        expect(question.description).toBeUndefined();
      });
    });

    describe("when there is no content", () => {
      it("should be undefined", () => {
        const question = new Question(createQuestionJSON());
        expect(question.description).toBeUndefined();
      });
    });
  });

  describe("guidance", () => {
    describe("when there is content and enabled", () => {
      it("should be populated", () => {
        const question = new Question(
          createQuestionJSON({
            guidance: "<h2>hello world</h2>",
            guidanceEnabled: true,
          })
        );
        expect(question.guidance).toBeDefined();
      });
    });

    describe("when it is disabled", () => {
      it("should be undefined", () => {
        const question = new Question(
          createQuestionJSON({ guidanceEnabled: false })
        );
        expect(question.guidance).toBeUndefined();
      });
    });

    describe("when there is no content", () => {
      it("should be undefined", () => {
        const question = new Question(createQuestionJSON());
        expect(question.guidance).toBeUndefined();
      });
    });
  });

  describe("definitions", () => {
    describe("when there is content and enabled", () => {
      it("should be populated when both label and content", () => {
        const question = new Question(
          createQuestionJSON({
            definitionLabel: "definition label",
            definitionContent: "<p>definition content</p>",
            definitionEnabled: true,
          })
        );
        expect(question.definitions).toBeDefined();
      });
      it("should be populated when label and no content", () => {
        const question = new Question(
          createQuestionJSON({
            definitionLabel: "definition label",
            definitionContent: "",
            definitionEnabled: true,
          })
        );
        expect(question.definitions).toBeDefined();
      });
      it("should be populated when no label and content", () => {
        const question = new Question(
          createQuestionJSON({
            definitionLabel: "",
            definitionContent: "<p>definition content</p>",
            definitionEnabled: true,
          })
        );
        expect(question.definitions).toBeDefined();
      });
    });

    describe("when it is disabled", () => {
      it("should be undefined ", () => {
        const question = new Question(
          createQuestionJSON({
            definitionLabel: "",
            definitionContent: "",
            definitionEnabled: false,
          })
        );
        expect(question.definitions).toBeUndefined();
      });
    });

    describe("when there is no content", () => {
      it("should be undefined when neither label or content", () => {
        const question = new Question(
          createQuestionJSON({
            definitionLabel: "",
            definitionContent: "",
          })
        );
        expect(question.definitions).toBeUndefined();
      });
    });
  });

  describe("additional information", () => {
    describe("when there is content and enabled", () => {
      it("should be populated when both label and content", () => {
        const question = new Question(
          createQuestionJSON({
            additionalInfoLabel: "additionalInfo label",
            additionalInfoContent: "<p>additionalInfo content</p>",
            additionalInfoEnabled: true,
          })
        );
        expect(last(question.answers).guidance).toBeDefined();
        expect(last(question.answers).guidance.show_guidance).toBeDefined();
        expect(last(question.answers).guidance.hide_guidance).toBeDefined();
        expect(last(question.answers).guidance.content).toBeDefined();
      });
      it("should be populated when label and no content", () => {
        const question = new Question(
          createQuestionJSON({
            additionalInfoLabel: "additionalInfo label",
            additionalInfoContent: "",
            additionalInfoEnabled: true,
          })
        );
        expect(last(question.answers).guidance).toBeDefined();
        expect(last(question.answers).guidance.show_guidance).toBeDefined();
        expect(last(question.answers).guidance.hide_guidance).toBeDefined();
        expect(last(question.answers).guidance.content).toBeUndefined();
      });
      it("should be populated when no label and content", () => {
        const question = new Question(
          createQuestionJSON({
            additionalInfoLabel: "",
            additionalInfoContent: "<p>additionalInfo content</p>",
            additionalInfoEnabled: true,
          })
        );
        expect(last(question.answers).guidance).toBeDefined();
        expect(last(question.answers).guidance.show_guidance).toBeFalsy();
        expect(last(question.answers).guidance.hide_guidance).toBeFalsy();
        expect(last(question.answers).guidance.content).toBeDefined();
      });

      it("should throw an error when no answers on the page", () => {
        expect(
          () =>
            new Question(
              createQuestionJSON({
                additionalInfoLabel: "Additional info",
                additionalInfoContent: "<p>Additional info content</p>",
                additionalInfoEnabled: true,
                answers: [],
              })
            )
        ).toThrow(/no answers/);
      });
    });

    describe("when it is disabled", () => {
      it("should be undefined", () => {
        const question = new Question(
          createQuestionJSON({
            definitionLabel: "",
            definitionContent: "",
            additionalInfoEnabled: false,
          })
        );
        expect(last(question.answers).guidance).toBeUndefined();
      });
    });

    describe("when there is no content", () => {
      it("should be undefined when neither label or content", () => {
        const question = new Question(
          createQuestionJSON({
            definitionLabel: "",
            definitionContent: "",
          })
        );
        expect(last(question.answers).guidance).toBeUndefined();
      });
    });
  });

  describe("DateRange", () => {
    let validation = {};
    beforeEach(() => {
      validation = {
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
          id: "2",
          enabled: true,
          custom: "2018-02-17",
          offset: {
            value: 10,
            unit: "Years",
          },
          relativePosition: "After",
        },
        minDuration: {
          id: "3",
          enabled: true,
          duration: {
            value: 13,
            unit: "Days",
          },
        },
        maxDuration: {
          id: "4",
          enabled: true,
          duration: {
            value: 2,
            unit: "Months",
          },
        },
      };
    });

    it("should convert Author DateRange to Runner-compatible format", () => {
      const answers = [
        {
          type: DATE_RANGE,
          id: "answer1",
          label: "Period from",
          secondaryLabel: "Period to",
          properties: { required: true },
          validation,
        },
      ];
      const question = new Question(createQuestionJSON({ answers }));

      expect(question).toMatchObject({
        type: DATE_RANGE,
        answers: [
          {
            label: "Period from",
            type: DATE,
            id: "answeranswer1from",
            mandatory: true,
          },
          {
            label: "Period to",
            type: DATE,
            id: "answeranswer1to",
            mandatory: true,
          },
        ],
      });
    });

    it("discards any other answers if DateRange used", () => {
      const answers = [
        {
          type: DATE_RANGE,
          id: "1",
          properties: { required: true },
          validation,
          childAnswers: [
            { id: "1from", label: "Period from" },
            { id: "1to", label: "Period to" },
          ],
        },
        { type: "TextField", id: "2" },
      ];
      const question = new Question(createQuestionJSON({ answers }));

      expect(question.answers).not.toContainEqual(
        expect.objectContaining({
          type: "TextField",
        })
      );
    });

    it("should create additionalAnswer answer if exists", () => {
      const answers = [
        {
          type: "Checkbox",
          id: "1",
          properties: { required: true },
          validation,
          options: [
            {
              id: "1",
              label: "Option 1",
            },
            {
              id: "2",
              label: "additionalAnswer option",
              additionalAnswer: {
                id: "3",
                type: "TextField",
                properties: { required: true },
              },
            },
          ],
        },
      ];
      const question = new Question(createQuestionJSON({ answers }));

      expect(question.answers[0].options).toHaveLength(2);
      expect(question.answers[0].options[1]).toMatchObject({
        detail_answer: {
          id: "answer3",
          mandatory: true,
          type: "TextField",
        },
      });
    });

    it("should not create other answer if other property is nil", () => {
      const answers = [
        {
          type: "Checkbox",
          id: "1",
          properties: { required: true },
          validation,
          options: [
            {
              id: "1",
              label: "Option 1",
            },
          ],
          other: null,
        },
      ];
      const question = new Question(createQuestionJSON({ answers }));

      expect(question.answers).toEqual([
        expect.objectContaining({
          type: "Checkbox",
        }),
      ]);
    });

    it("should create date validation", () => {
      const answers = [
        {
          type: DATE_RANGE,
          id: "1",
          properties: { required: true },
          validation,
          childAnswers: [
            { id: "1from", label: "Period from" },
            { id: "1to", label: "Period to" },
          ],
        },
      ];
      const question = new Question(createQuestionJSON({ answers }));

      expect(question.answers[0]).toEqual(
        expect.objectContaining({
          minimum: {
            value: "2017-02-17",
            offset_by: {
              days: -4,
            },
          },
        })
      );
      expect(question.answers[1]).toEqual(
        expect.objectContaining({
          maximum: {
            value: "2018-02-17",
            offset_by: {
              years: 10,
            },
          },
        })
      );
      expect(question.period_limits).toEqual(
        expect.objectContaining({
          minimum: {
            days: 13,
          },
        })
      );
      expect(question.period_limits).toEqual(
        expect.objectContaining({
          maximum: {
            months: 2,
          },
        })
      );
    });
  });

  describe("piping", () => {
    const createPipe = ({
      id = "7151378b-579d-40bf-b4d4-a378c573706a",
      text = "foo",
      pipeType = "answers",
    } = {}) => `<span data-piped="${pipeType}" data-id="${id}">${text}</span>`;

    const createContext = (
      metadata = [{ id: "123", type: "Text", key: "my_metadata" }]
    ) => ({
      questionnaireJson: {
        metadata,
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        id: `7151378b-579d-40bf-b4d4-a378c573706a`,
                        type: "Text",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    it("should handle piped values in title", () => {
      const question = new Question(
        createQuestionJSON({
          title: createPipe(),
        }),
        createContext()
      );

      expect(question.title).toEqual(
        "{{ answers['answer7151378b-579d-40bf-b4d4-a378c573706a'] }}"
      );
    });

    it("should handle piped values in guidance", () => {
      const question = new Question(
        createQuestionJSON({
          guidance: `<h2>${createPipe({ id: 123, pipeType: "metadata" })}</h2>`,
          guidanceEnabled: true,
        }),
        createContext()
      );

      expect(question.guidance.content[0]).toEqual({
        title: "{{ metadata['my_metadata'] }}",
      });
    });

    it("should ensure description text is not truncated if it includes multiple p tags", () => {
      const question = new Question(
        createQuestionJSON({
          description: `<p>foo</p><p>bar</p>`,
          descriptionEnabled: true,
        }),
        createContext()
      );

      expect(question.description).toEqual("<p>foo</p><p>bar</p>");
    });

    it("should handle piped values in description", () => {
      const question = new Question(
        createQuestionJSON({
          description: `<h2>${createPipe()}</h2>`,
          descriptionEnabled: true,
        }),
        createContext()
      );

      expect(question.description).toEqual(
        "<h2>{{ answers['answer7151378b-579d-40bf-b4d4-a378c573706a'] }}</h2>"
      );
    });
  });

  describe("mutually exclusive questions", () => {
    let answers;
    beforeEach(() => {
      answers = [
        {
          type: "Checkbox",
          id: "1",
          label: "test",
          properties: { required: true },
          options: [
            {
              id: "1",
              label: "Option 1",
            },
            {
              id: "2",
              label: "Option 2",
            },
          ],
          mutuallyExclusiveOption: {
            id: "3",
            label: "Mutually exclusive",
          },
        },
      ];
    });

    it("should have a question type of mutually exclusive", () => {
      const question = new Question(createQuestionJSON({ answers }));
      expect(question).toMatchObject({
        type: "MutuallyExclusive",
      });
    });

    it("should have a question type of general when no mutually exclusive option", () => {
      const question = new Question(
        createQuestionJSON({
          answers: [omit("mutuallyExclusiveOption", answers[0])],
        })
      );
      expect(question).toMatchObject({
        type: "General",
      });
    });

    it("should have a question type of general when mutually exclusive option is null", () => {
      const question = new Question(
        createQuestionJSON({
          answers: [set("mutuallyExclusiveOption", null, answers[0])],
        })
      );
      expect(question).toMatchObject({
        type: "General",
      });
    });

    it("should return 2 answers when no other option", () => {
      const question = new Question(createQuestionJSON({ answers }));
      expect(question.answers).toHaveLength(2);
    });

    it("should have checkbox answer as last answer", () => {
      const question = new Question(createQuestionJSON({ answers }));
      expect(last(question.answers)).toMatchObject({
        type: "Checkbox",
      });
    });

    it("should have unique answer id for the last answer", () => {
      const question = new Question(createQuestionJSON({ answers }));
      expect(last(question.answers)).toMatchObject({
        id: "answer1-exclusive",
      });
    });

    it("should have a mandatory property", () => {
      const question = new Question(createQuestionJSON({ answers }));
      expect(question).toHaveProperty("mandatory");
    });

    it("should not inherit the label property", () => {
      const question = new Question(createQuestionJSON({ answers }));
      expect(question).not.toHaveProperty("label");
    });

    it("should set mandatory on exclusive child answers to false", () => {
      const question = new Question(createQuestionJSON({ answers }));
      expect(question).toMatchObject({
        mandatory: true,
      });
      question.answers.map(answer => {
        expect(answer).toMatchObject({
          mandatory: false,
        });
      });
    });

    it("should have a checkbox answer as last answer when radio answer is used", () => {
      const question = new Question(
        createQuestionJSON({
          answers: [set("type", "Radio", answers[0])],
        })
      );
      expect(question.answers).toEqual([
        expect.objectContaining({
          type: "Radio",
        }),
        expect.objectContaining({
          type: "Checkbox",
        }),
      ]);
    });

    it("should have a single option in the mutually exclusive answer", () => {
      const question = new Question(createQuestionJSON({ answers }));
      expect(last(question.answers).options).toEqual([
        {
          label: "Mutually exclusive",
          value: "Mutually exclusive",
        },
      ]);
    });

    it("should have a single option in mutually exclusive answer when another additionalAnswerOption is present", () => {
      const question = new Question(
        createQuestionJSON({
          answers: [
            set(
              "type",
              "Radio",
              set(
                "options",
                [
                  {
                    option: {
                      id: "4",
                      label: "additionalAnswer option",
                      additionalAnswer: {
                        id: "2",
                        type: "TextField",
                        properties: { required: true },
                      },
                    },
                  },
                ],
                answers[0]
              )
            ),
          ],
        })
      );

      expect(last(question.answers).options).toEqual([
        {
          label: "Mutually exclusive",
          value: "Mutually exclusive",
        },
      ]);
    });
  });

  describe("Calculated Answer Validations", () => {
    let validation;
    beforeEach(() => {
      validation = {
        enabled: true,
        id: "foo",
        entityType: "Custom",
        condition: "Equal",
        custom: 5,
      };
    });

    it("should change the type to Calculated when there is a group validation", () => {
      const question = new Question(
        createQuestionJSON({
          totalValidation: validation,
        })
      );

      expect(question.type).toEqual("Calculated");
      expect(question.calculations).toHaveLength(1);
    });

    it("should do nothing when the validation is disabled", () => {
      validation.enabled = false;
      const question = new Question(
        createQuestionJSON({
          totalValidation: validation,
        })
      );

      expect(question.type).toEqual("General");
      expect(question.calculations).not.toBeDefined();
    });

    it("should show all answers", () => {
      const question = new Question(
        createQuestionJSON({
          totalValidation: validation,
          answers: [
            { id: "1", type: NUMBER, properties: {} },
            { id: "2", type: NUMBER, properties: {} },
          ],
        })
      );

      expect(question.answers.map(a => a.id)).toEqual(["answer1", "answer2"]);
    });

    it("should always output the calculation type as sum", () => {
      const question = new Question(
        createQuestionJSON({
          totalValidation: validation,
        })
      );
      expect(question.calculations[0].calculation_type).toEqual("sum");
    });

    it("should set the list of answers to calculate as all of the correct type on the page", () => {
      const question = new Question(
        createQuestionJSON({
          totalValidation: validation,
          answers: [
            { id: "1", type: NUMBER, properties: {} },
            { id: "2", type: NUMBER, properties: {} },
          ],
        })
      );

      expect(question.calculations[0].answers_to_calculate).toEqual([
        "answer1",
        "answer2",
      ]);
    });

    it("should map the condition the runner condition", () => {
      [
        { author: "GreaterThan", runner: ["greater than"] },
        { author: "GreaterOrEqual", runner: ["greater than", "equals"] },
        { author: "Equal", runner: ["equals"] },
        { author: "LessOrEqual", runner: ["less than", "equals"] },
        { author: "LessThan", runner: ["less than"] },
      ].forEach(({ author, runner }) => {
        validation.condition = author;
        const question = new Question(
          createQuestionJSON({
            totalValidation: validation,
          })
        );
        expect(question.calculations[0].conditions).toEqual(runner);
      });
    });

    it("should set the custom value when the entiyType is Custom", () => {
      validation.entityType = "Custom";
      validation.custom = 10;
      validation.previousAnswer = { id: 20 };
      const question = new Question(
        createQuestionJSON({
          totalValidation: validation,
        })
      );
      expect(question.calculations[0].value).toEqual(10);
      expect(question.calculations[0].answer_id).not.toBeDefined();
    });

    it("should set the answer_id to the previous answer when entityType is PreviousAnswer", () => {
      validation.entityType = "PreviousAnswer";
      validation.custom = 10;
      validation.previousAnswer = { id: 20 };
      const question = new Question(
        createQuestionJSON({
          totalValidation: validation,
        })
      );
      expect(question.calculations[0].value).not.toBeDefined();
      expect(question.calculations[0].answer_id).toEqual("answer20");
    });
  });
});
