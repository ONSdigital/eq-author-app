const { get, flow, find } = require("lodash/fp");

const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  createAnswer,
  queryAnswer,
  deleteAnswer,
} = require("../../tests/utils/contextBuilder/answer");

const {
  createOption,
  createMutuallyExclusiveOption,
  queryOption,
  updateOption,
  deleteOption,
  moveOption,
} = require("../../tests/utils/contextBuilder/option");

const { queryPage } = require("../../tests/utils/contextBuilder/page");

const { RADIO, CHECKBOX, SELECT } = require("../../constants/answerTypes");

const getPage = get("sections[0].folders[0].pages[0]");
const getAnswer = flow(getPage, get("answers[0]"));
const getOption = flow(getAnswer, get("options[0]"));
const getMutuallyExclusiveOption = find({ mutuallyExclusive: true });

describe("multiple choice answer", () => {
  let ctx;

  afterEach(async () => {
    await deleteQuestionnaire(ctx, ctx.questionnaire.id);
    ctx = null;
  });
  describe("create", () => {
    it("should create a radio answer with two options", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [],
                  },
                ],
              },
            ],
          },
        ],
      });
      const questionnaire = ctx.questionnaire;

      const createdAnswer = await createAnswer(ctx, {
        type: RADIO,
        questionPageId: getPage(questionnaire).id,
      });

      expect(createdAnswer.options).toHaveLength(2);
      expect(createdAnswer.mutuallyExclusiveOption).toBeNull();

      expect(createdAnswer.options[0]).toMatchObject({
        id: expect.any(String),
        displayName: "Untitled label",
        label: "",
        description: null,
        value: null,
        qCode: "",
        answer: {
          id: createdAnswer.id,
        },
        additionalAnswer: null,
      });
    });

    it("should create a checkbox answer with one option", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [{}],
              },
            ],
          },
        ],
      });
      const questionnaire = ctx.questionnaire;

      const createdAnswer = await createAnswer(ctx, {
        type: CHECKBOX,
        questionPageId: getPage(questionnaire).id,
      });

      expect(createdAnswer.options).toHaveLength(1);
      expect(createdAnswer.mutuallyExclusiveOption).toBeNull();
      expect(createdAnswer.options[0]).toMatchObject({
        id: expect.any(String),
        displayName: "Untitled label",
        label: "",
        description: null,
        value: null,
        qCode: "",
        answer: {
          id: createdAnswer.id,
        },
        additionalAnswer: null,
      });
    });

    it("should create a select answer with 25 options", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [{}],
              },
            ],
          },
        ],
      });
      const questionnaire = ctx.questionnaire;

      const createdAnswer = await createAnswer(ctx, {
        type: SELECT,
        questionPageId: getPage(questionnaire).id,
      });

      expect(createdAnswer.options).toHaveLength(25);
      expect(createdAnswer.mutuallyExclusiveOption).toBeNull();
      expect(createdAnswer.options[0]).toMatchObject({
        id: expect.any(String),
        label: "",
        qCode: "",
      });
    });
  });

  describe("query", () => {
    it("should resolve multiple choice fields", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: RADIO,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      const answer = getAnswer(ctx.questionnaire);
      const queriedAnswer = await queryAnswer(
        ctx,
        getAnswer(ctx.questionnaire).id
      );
      expect(queriedAnswer).toMatchObject({
        properties: expect.any(Object),
      });
      expect(queriedAnswer.options).toHaveLength(2);
      expect(queriedAnswer.options.map((o) => o.id)).toEqual(
        answer.options.map((o) => o.id)
      );
    });

    it("should resolve mutuallyExclusiveOption", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: RADIO,
                        mutuallyExclusiveOption: {
                          label: "Exclusive",
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      const answer = getAnswer(ctx.questionnaire);
      const queriedAnswer = await queryAnswer(
        ctx,
        getAnswer(ctx.questionnaire).id
      );

      expect(queriedAnswer.options).toHaveLength(2);
      expect(queriedAnswer.mutuallyExclusiveOption.id).toEqual(
        getMutuallyExclusiveOption(answer.options).id
      );
    });
  });

  describe("delete", () => {
    it("should delete an answer", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: RADIO,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      const questionnaire = ctx.questionnaire;

      const answer = getAnswer(questionnaire);
      await deleteAnswer(ctx, answer.id);
      const deletedAnswer = await queryAnswer(ctx, answer.id);
      expect(deletedAnswer).toBeNull();
    });
  });

  describe("option", () => {
    describe("create", () => {
      it("should create an option", async () => {
        ctx = await buildContext({
          sections: [
            {
              folders: [
                {
                  pages: [
                    {
                      answers: [
                        {
                          type: CHECKBOX,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
        const questionnaire = ctx.questionnaire;

        const answer = getAnswer(questionnaire);
        const createdOption = await createOption(ctx, {
          answerId: answer.id,
          label: "My label",
          description: "Description",
          value: "Value",
          qCode: "qCode",
        });
        expect(createdOption).toMatchObject({
          label: "My label",
          description: "Description",
          value: "Value",
          qCode: "qCode",
          additionalAnswer: null,
        });
      });

      it("should create an option with an additional answer", async () => {
        ctx = await buildContext({
          sections: [
            {
              folders: [
                {
                  pages: [
                    {
                      answers: [
                        {
                          type: CHECKBOX,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
        const questionnaire = ctx.questionnaire;

        const answer = getAnswer(questionnaire);
        const createdOption = await createOption(ctx, {
          answerId: answer.id,
          hasAdditionalAnswer: true,
        });
        expect(createdOption).toMatchObject({
          additionalAnswer: {
            id: expect.any(String),
          },
        });
      });

      it("should create a mutually exclusive option", async () => {
        ctx = await buildContext({
          sections: [
            {
              folders: [
                {
                  pages: [
                    {
                      answers: [
                        {
                          type: CHECKBOX,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
        const questionnaire = ctx.questionnaire;

        const answer = getAnswer(questionnaire);
        const createdOption = await createMutuallyExclusiveOption(ctx, {
          answerId: answer.id,
          label: "My exclusive option",
        });
        expect(createdOption).toMatchObject({
          displayName: "My exclusive option",
        });
      });
    });

    describe("mutate", () => {
      it("should mutate options", async () => {
        ctx = await buildContext({
          sections: [
            {
              folders: [
                {
                  pages: [
                    {
                      answers: [
                        {
                          type: RADIO,
                          options: [
                            {
                              additionalAnswer: {},
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
        });
        const questionnaire = ctx.questionnaire;

        const option = getOption(questionnaire);
        const update = {
          id: option.id,
          label: "option-label-update",
          description: "option-description-update",
          value: "answer-value-update",
          qCode: "answer-qcode-update",
          additionalAnswer: {
            id: option.additionalAnswer.id,
            label: "additonal-answer-label",
          },
        };
        const updatedOption = await updateOption(ctx, update);
        expect(updatedOption).toEqual(expect.objectContaining(update));
      });
    });

    describe("update", () => {
      beforeEach(async () => {
        ctx = await buildContext({
          sections: [
            {
              folders: [
                {
                  pages: [
                    {
                      answers: [
                        {
                          id: "checkbox-id",
                          type: CHECKBOX,
                          options: [{}],
                        },
                      ],
                      routing: {
                        rules: [
                          {
                            expressionGroup: {
                              expressions: [{}],
                            },
                          },
                        ],
                      },
                    },
                    {
                      answers: [
                        {
                          type: RADIO,
                          options: [
                            {
                              id: "dynamic-answer",
                              dynamicAnswer: true,
                              dynamicAnswerID: "checkbox-id",
                            },
                            {
                              id: "option-2",
                              label: "keep-me",
                            },
                            {
                              id: "option-3",
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
        });
      });

      it("should update options", async () => {
        const questionnaire = ctx.questionnaire;

        const option = getOption(questionnaire);
        const update = {
          id: option.id,
          dynamicAnswer: true,
        };

        const updatedOption = await updateOption(ctx, update);
        expect(updatedOption).toEqual(expect.objectContaining(update));
        expect(
          questionnaire.sections[0].folders[0].pages[0].answers[0].options
            .length
        ).toEqual(2);
      });

      it("should remove deleted options from routing rules", async () => {
        const { questionnaire } = ctx;

        const dynamicOption =
          questionnaire.sections[0].folders[0].pages[1].answers[0].options[0];
        const thirdOption =
          questionnaire.sections[0].folders[0].pages[1].answers[0].options[2];

        const expression =
          questionnaire.sections[0].folders[0].pages[0].routing.rules[0]
            .expressionGroup.expressions[0];
        expression.right = {
          optionIds: [thirdOption.id],
        };

        const update = {
          id: dynamicOption.id,
          dynamicAnswer: true,
        };

        await updateOption(ctx, update);

        expect(expression.right.optionIds.length).toBe(0);
      });
    });

    describe("delete", () => {
      beforeEach(async () => {
        ctx = await buildContext({
          sections: [
            {
              folders: [
                {
                  pages: [
                    {
                      answers: [
                        {
                          type: CHECKBOX,
                          options: [{}],
                        },
                      ],
                      routing: {
                        rules: [
                          {
                            expressionGroup: {
                              expressions: [{}],
                            },
                          },
                        ],
                      },
                    },
                    {
                      answers: [
                        {
                          type: CHECKBOX,
                          options: [{}],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
      });

      it("should delete options and return answer object", async () => {
        const questionnaire = ctx.questionnaire;

        const option = getOption(questionnaire);

        const deleteOptionsResult = await deleteOption(ctx, option);
        expect(deleteOptionsResult.__typename).toEqual("MultipleChoiceAnswer");

        const queriedOption = await queryOption(ctx, option.id);
        expect(queriedOption).toBeNull();
      });

      it("should remove dynamicAnswerID from dynamic radio answers", async () => {
        const { questionnaire } = ctx;

        questionnaire.sections[0].folders[0].pages.push({
          answers: [
            {
              type: RADIO,
              options: [
                {
                  dynamicAnswer: true,
                  dynamicAnswerID:
                    questionnaire.sections[0].folders[0].pages[0].answers[0].id,
                },
              ],
            },
          ],
        });

        questionnaire.sections[0].folders[0].pages[0].answers[0].options.push({
          id: 1,
          label: "",
          qCode: "",
        });

        await deleteOption(
          ctx,
          questionnaire.sections[0].folders[0].pages[0].answers[0].options[0]
        );

        expect(
          questionnaire.sections[0].folders[0].pages[2].answers[0].options[0]
            .dynamicAnswerID
        ).toBeNull();
      });

      it("should remove deleted options from routing rules", async () => {
        const { questionnaire } = ctx;

        const option = getOption(questionnaire);

        const expression =
          questionnaire.sections[0].folders[0].pages[0].routing.rules[0]
            .expressionGroup.expressions[0];
        expression.right = {
          optionIds: [option.id],
        };

        await deleteOption(ctx, option);

        expect(expression.right.optionIds.length).toBe(0);
      });

      it("should remove deleted options from skip conditions", async () => {
        const { questionnaire } = ctx;

        const option = getOption(questionnaire);

        const secondPage = questionnaire.sections[0].folders[0].pages[1];
        secondPage.skipConditions = [
          {
            id: "skip-1",
            operator: "And",
            expressions: [
              {
                id: "expr-1",
                condition: "AllOf",
                left: {
                  type: "Answer",
                  answerId: "answer-1",
                },
                right: {
                  type: "SelectedOptions",
                  optionIds: [option.id],
                },
              },
            ],
          },
        ];

        const expression = secondPage.skipConditions[0].expressions[0];

        expression.right = {
          optionIds: [option.id],
        };

        await deleteOption(ctx, option);

        expect(expression.right.optionIds.length).toBe(0);
      });
    });

    describe("move", () => {
      it("should reorder options", async () => {
        ctx = await buildContext({
          sections: [
            {
              folders: [
                {
                  pages: [
                    {
                      answers: [
                        {
                          type: CHECKBOX,
                          options: [{}, {}],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
        const questionnaire = ctx.questionnaire;

        let answer = getAnswer(questionnaire);

        const option1 = answer.options[0];
        const option2 = answer.options[1];

        expect(answer.options).toMatchObject([
          { id: option1.id },
          { id: option2.id },
        ]);

        answer = await moveOption(ctx, { id: option2.id, position: 0 });

        expect(answer.options).toMatchObject([
          { id: option2.id },
          { id: option1.id },
        ]);
      });
    });
  });

  describe("schema validation", () => {
    const context = {
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      id: "84ab357d",
                      type: "Radio",
                      label: "",
                      qCode: "qcode A",
                      options: [
                        {
                          id: "84ab357d",
                          type: "Radio",
                          label: "",
                          qCode: "qCode1",
                        },
                        {
                          id: "2e275ff8",
                          label: "b",
                          qCode: "qCode2",
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

    it("should only validate label on options", async () => {
      ctx = await buildContext(context);

      const page = ctx.questionnaire.sections[0].folders[0].pages[0];
      const readPage = await queryPage(ctx, page.id);

      expect(readPage).toMatchObject({
        validationErrorInfo: {
          totalCount: 1,
          errors: [
            expect.objectContaining({ errorCode: "ERR_VALID_REQUIRED" }),
          ],
        },
      });
    });

    it("should return validation error on both option labels when labels are the same", async () => {
      context.sections[0].folders[0].pages[0].answers[0].options[0].label = "b";
      ctx = await buildContext(context);

      const page = ctx.questionnaire.sections[0].folders[0].pages[0];
      const readPage = await queryPage(ctx, page.id);

      expect(readPage).toMatchObject({
        validationErrorInfo: {
          totalCount: 2,
          errors: [
            expect.objectContaining({ errorCode: "ERR_UNIQUE_REQUIRED" }),
            expect.objectContaining({ errorCode: "ERR_UNIQUE_REQUIRED" }),
          ],
        },
      });
    });
  });
});
