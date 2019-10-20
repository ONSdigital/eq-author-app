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
  queryQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  createOption,
  createMutuallyExclusiveOption,
  queryOption,
  updateOption,
  deleteOption,
  moveOption,
} = require("../../tests/utils/contextBuilder/option");

const { RADIO, CHECKBOX } = require("../../constants/answerTypes");

const getPage = get("sections[0].pages[0]");
const getAnswer = flow(
  getPage,
  get("answers[0]")
);
const getOption = flow(
  getAnswer,
  get("options[0]")
);
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
            pages: [
              {
                answers: [],
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
        displayName: "Untitled Label",
        label: "",
        description: null,
        value: null,
        qCode: null,
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
            pages: [{}],
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
        displayName: "Untitled Label",
        label: "",
        description: null,
        value: null,
        qCode: null,
        answer: {
          id: createdAnswer.id,
        },
        additionalAnswer: null,
      });
    });
  });

  describe("query", () => {
    it("should resolve multiple choice fields", async () => {
      ctx = await buildContext({
        sections: [
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
      expect(queriedAnswer.options.map(o => o.id)).toEqual(
        answer.options.map(o => o.id)
      );
    });

    it("should resolve mutuallyExclusiveOption", async () => {
      ctx = await buildContext({
        sections: [
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

    describe("delete", () => {
      it("should delete options and return answer object", async () => {
        ctx = await buildContext({
          sections: [
            {
              pages: [
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
        });
        const questionnaire = ctx.questionnaire;

        const option = getOption(questionnaire);

        const deleteOptionsResult = await deleteOption(ctx, option);
        expect(deleteOptionsResult.__typename).toEqual("MultipleChoiceAnswer");

        const queriedOption = await queryOption(ctx, option.id);
        expect(queriedOption).toBeNull();
      });
    });

    describe("move", () => {
      it("should reorder options", async () => {
        ctx = await buildContext({
          sections: [
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

  describe("validating multiple choice answer", () => {
    it("should only validate label on options", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    id: "84ab357d-f8a6-433e-8907-2d62980e6ce8",
                    type: "Radio",
                    label: "",
                    secondaryLabel: null,
                    description: "",
                    guidance: "",
                    properties: {
                      required: false,
                    },
                    qCode: "",
                    options: [
                      {
                        id: "c0aa1df9-5dfd-4e68-8a13-36c5af5dd7fa",
                        label: "",
                        description: null,
                        value: null,
                        qCode: null,
                        additionalAnswer: null,
                      },
                      {
                        id: "2e275ff8-1387-4d31-bd2c-4add13b9e89d",
                        label: "c",
                        description: null,
                        value: null,
                        qCode: null,
                        additionalAnswer: null,
                      },
                    ],
                    mutuallyExclusiveOption: null,
                  },
                ],
              },
            ],
          },
        ],
      });
      let questionnaire = await queryQuestionnaire(ctx);
      expect(questionnaire.totalErrorCount).toBe(1);
      // console.log(questionnaire);

      // const answer = await updateAnswer(ctx, {
      //   id: "84ab357d-f8a6-433e-8907-2d62980e6ce8",
      //   label: "aa",
      // });
      // const answer = getAnswer(ctx.questionnaire);
      // const queriedAnswer = await queryAnswer(
      //   ctx,
      //   getAnswer(ctx.questionnaire).id
      // );
      // console.log(queriedAnswer);
      // questionnaire = await queryQuestionnaire(ctx);
      // console.log(questionnaire);
    });

    // const questionnaire = ctx.questionnaire;
    // const answers = questionnaire.sections[0].pages[0].answers;
    // const calSumPage = questionnaire.sections[0].pages[1];

    // await updateCalculatedSummaryPage(ctx, {
    //   id: calSumPage.id,
    //   title: "Goo",
    //   summaryAnswers: [answers[0].id, answers[1].id],
    // });
    // const validResult = await queryPage(ctx, calSumPage.id);

    // expect(validResult.validationErrorInfo).toEqual({
    //   errors: [
    //     {
    //       errorCode: "ERR_CALCULATED_UNIT_INCONSISTENCY",
    //       field: "summaryAnswers",
    //       id: `pages-${calSumPage.id}-summaryAnswers`,
    //       type: "pages",
    //     },
    //   ],
    //   totalCount: 1,
    // });
  });
});
