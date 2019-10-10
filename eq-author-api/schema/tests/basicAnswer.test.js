const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  createAnswer,
  updateAnswer,
  updateAnswersOfType,
  queryAnswer,
  deleteAnswer,
  moveAnswer,
} = require("../../tests/utils/contextBuilder/answer");

const {
  NUMBER,
  CURRENCY,
  TEXTFIELD,
  DURATION,
} = require("../../constants/answerTypes");

describe("basic answer", () => {
  let ctx, questionnaire;
  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("create", () => {
    [NUMBER, CURRENCY, TEXTFIELD, DURATION].forEach(async type => {
      it(`should create an ${type} answer`, async () => {
        ctx = await buildContext({
          sections: [{ pages: [{}] }],
        });
        questionnaire = ctx.questionnaire;

        const answer = await createAnswer(ctx, {
          description: "answer-description",
          guidance: "answer-guidance",
          label: "answer-label",
          secondaryLabel: "answer-secondaryLabel",
          qCode: "answer-qcode",
          type,
          questionPageId: questionnaire.sections[0].pages[0].id,
        });

        expect(answer).toEqual(
          expect.objectContaining({
            description: "answer-description",
            guidance: "answer-guidance",
            label: "answer-label",
            secondaryLabel: "answer-secondaryLabel",
            qCode: "answer-qcode",
          })
        );
      });
    });
  });

  describe("mutate", () => {
    it("should mutate an answer", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    description: "answer-description",
                    guidance: "answer-guidance",
                    label: "answer-label",
                    secondaryLabel: "answer-secondaryLabel",
                    qCode: "answer-qcode",
                    type: NUMBER,
                    properties: {
                      decimals: 2,
                      required: false,
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const answer = questionnaire.sections[0].pages[0].answers[0];
      const update = {
        id: answer.id,
        description: "answer-description-update",
        guidance: "answer-guidance-update",
        label: "answer-label-update",
        qCode: "answer-qcode-update",
        properties: {
          decimals: 0,
          required: true,
        },
      };
      const updatedAnswer = await updateAnswer(ctx, update);
      expect(updatedAnswer).toMatchObject(update);
    });
  });

  describe("grouped answers", () => {
    it("should be created with the same properties as other answers in the group", async () => {
      const properties = {
        decimals: 20,
      };
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: NUMBER,
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const page = questionnaire.sections[0].pages[0];
      await updateAnswersOfType(ctx, {
        questionPageId: page.id,
        type: NUMBER,
        properties,
      });

      const answer = await createAnswer(ctx, {
        type: NUMBER,
        questionPageId: questionnaire.sections[0].pages[0].id,
      });

      const queriedAnswer = await queryAnswer(ctx, answer.id);

      expect(queriedAnswer.properties).toMatchObject(properties);
    });

    it("should update the properties of a number of answers", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: NUMBER,
                    properties: {
                      decimals: 1,
                    },
                  },
                  {
                    type: NUMBER,
                    properties: {
                      decimals: 1,
                    },
                  },
                  {
                    type: CURRENCY,
                    properties: {
                      decimals: 0,
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const page = questionnaire.sections[0].pages[0];

      const updatedAnswers = await updateAnswersOfType(ctx, {
        questionPageId: page.id,
        type: NUMBER,
        properties: {
          decimals: 5,
        },
      });

      expect(updatedAnswers).toMatchObject([
        {
          id: page.answers[0].id,
          properties: {
            decimals: 5,
          },
        },
        {
          id: page.answers[1].id,
          properties: {
            decimals: 5,
          },
        },
      ]);

      const queriedAnswer = await queryAnswer(ctx, page.answers[2].id);
      expect(queriedAnswer.properties.decimals).toEqual(0);
    });
  });

  describe("moving", () => {
    it("should be able to be moved forward", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                answers: [
                  { type: NUMBER },
                  { type: CURRENCY },
                  { type: TEXTFIELD },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const answers = questionnaire.sections[0].pages[0].answers;
      const currentAnswerOrder = answers.map(a => a.id);

      const answerToMoveId = currentAnswerOrder[0];

      const movedAnswer = await moveAnswer(ctx, {
        id: answerToMoveId,
        position: 1,
      });
      expect(movedAnswer.page.answers.map(a => a.id)).toEqual([
        currentAnswerOrder[1],
        currentAnswerOrder[0], // The moved answer
        currentAnswerOrder[2],
      ]);
    });

    it("should be able to be moved backward", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                answers: [
                  { type: NUMBER },
                  { type: CURRENCY },
                  { type: TEXTFIELD },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const answers = questionnaire.sections[0].pages[0].answers;
      const currentAnswerOrder = answers.map(a => a.id);

      const movedAnswer = await moveAnswer(ctx, {
        id: currentAnswerOrder[2],
        position: 1,
      });
      expect(movedAnswer.page.answers.map(a => a.id)).toEqual([
        currentAnswerOrder[0],
        currentAnswerOrder[2],
        currentAnswerOrder[1],
      ]);
    });
  });

  describe("query", () => {
    let answer, queriedAnswer;

    beforeEach(async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: NUMBER,
                    description: "",
                    guidance: "",
                    label: "",
                    secondaryLabel: "",
                    qCode: "",
                    properties: {
                      required: false,
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      answer = questionnaire.sections[0].pages[0].answers[0];
      queriedAnswer = await queryAnswer(ctx, answer.id);
    });

    it("should resolve answer fields", () => {
      expect(queriedAnswer).toMatchObject({
        id: expect.any(String),
        displayName: expect.any(String),
        description: expect.any(String),
        guidance: expect.any(String),
        qCode: expect.any(String),
        label: expect.any(String),
        secondaryLabel: expect.any(String),
        secondaryLabelDefault: expect.any(String),
        type: expect.any(String),
        page: expect.any(Object),
        properties: expect.any(Object),
        validation: expect.any(Object),
        validationErrorInfo: expect.any(Object),
      });
    });

    it("should resolve type", () => {
      expect(queriedAnswer.type).toEqual(answer.type);
    });

    it("should resolve page", () => {
      expect(queriedAnswer.page.id).toEqual(
        questionnaire.sections[0].pages[0].id
      );
    });

    it("should resolve properties", () => {
      expect(queriedAnswer.properties).toEqual(
        expect.objectContaining({
          required: false,
        })
      );
    });

    it("should resolve validation", () => {
      expect(queriedAnswer.validation).toMatchObject({
        maxValue: expect.any(Object),
        minValue: expect.any(Object),
      });
    });

    it("should resolve validation errors", () => {
      expect(queriedAnswer.validationErrorInfo).toMatchObject({
        errors: expect.any(Array),
        totalCount: expect.any(Number),
      });
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
                    type: NUMBER,
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const answer = questionnaire.sections[0].pages[0].answers[0];
      await deleteAnswer(ctx, answer.id);
      const deletedAnswer = await queryAnswer(ctx, answer.id);
      expect(deletedAnswer).toBeNull();
    });

    it("should return the page", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: NUMBER,
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const answer = questionnaire.sections[0].pages[0].answers[0];
      const page = await deleteAnswer(ctx, answer.id);
      expect(page.id).toEqual(questionnaire.sections[0].pages[0].id);
    });
  });
});
