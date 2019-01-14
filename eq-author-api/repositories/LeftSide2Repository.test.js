const knex = require("knex")(require("../knexfile"));
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);
const answerTypes = require("../constants/answerTypes");
const {
  SELECTED_ANSWER_DELETED,
  NO_ROUTABLE_ANSWER_ON_PAGE,
  NULL,
} = require("../constants/routingNoLeftSide");

const LeftSideRepository = require("./LeftSide2Repository")(knex);

describe("Left Side Repository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());

  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  let expression;
  let answer;
  let secondAnswer;
  beforeEach(async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              answers: [
                {
                  type: answerTypes.NUMBER,
                },
                {
                  type: answerTypes.NUMBER,
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
          ],
        },
      ],
    });
    const page = questionnaire.sections[0].pages[0];
    expression = page.routing.rules[0].expressionGroup.expressions[0];
    answer = page.answers[0];
    secondAnswer = page.answers[1];
  });

  describe("insert", () => {
    it("should create an expression side for the expression", async () => {
      const leftSide = await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id,
      });
      expect(leftSide).toMatchObject({
        id: expect.any(Number),
        expressionId: expression.id,
        answerId: answer.id,
        type: "Answer",
      });
    });

    it("should error when attempting to insert a second for an expression", async () => {
      await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id,
      });
      try {
        await LeftSideRepository.insert({
          expressionId: expression.id,
          answerId: answer.id,
        });
      } catch (e) {
        expect(e.message).toMatch(/unique constraint/);
        return;
      }
      expect(true).toBe(false);
    });

    it("should create a Null left side when a nullReason is given", async () => {
      const leftSide = await LeftSideRepository.insert({
        expressionId: expression.id,
        nullReason: NO_ROUTABLE_ANSWER_ON_PAGE,
      });
      expect(leftSide).toMatchObject({
        id: expect.any(Number),
        expressionId: expression.id,
        type: "Null",
        nullReason: NO_ROUTABLE_ANSWER_ON_PAGE,
      });
    });
  });

  describe("update", () => {
    it("should update the left side to new answer", async () => {
      const leftSide = await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id,
      });

      const updateResult = await LeftSideRepository.update({
        id: leftSide.id,
        answerId: secondAnswer.id,
      });

      expect(updateResult).toMatchObject({
        id: leftSide.id,
        expressionId: expression.id,
        answerId: secondAnswer.id,
        type: "Answer",
        nullReason: NULL,
      });
    });
  });

  describe("getByExpressionId", () => {
    it("should return the left side expression for the expression id", async () => {
      const leftSide = await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id,
      });
      const readExpression = await LeftSideRepository.getByExpressionId(
        expression.id
      );
      expect(readExpression).toMatchObject({
        id: leftSide.id,
      });
    });
  });

  describe("clearByAnswerId", () => {
    it("should clear all left sides with a given answerId and give reason", async () => {
      const leftSide = await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id,
      });
      const deleteResult = await LeftSideRepository.clearByAnswerId(
        answer.id,
        SELECTED_ANSWER_DELETED
      );
      expect(deleteResult).toMatchObject([
        {
          ...leftSide,
          answerId: null,
          type: "Null",
          nullReason: SELECTED_ANSWER_DELETED,
        },
      ]);
    });
  });

  describe("setMissingDefaults", () => {
    it("should update all Null LeftSides for a Routing to the given answer", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: answerTypes.NUMBER,
                  },
                ],
                routing: {
                  rules: [
                    {
                      expressionGroup: {
                        expressions: [
                          {
                            left: {
                              type: "Null",
                              nullReason: NO_ROUTABLE_ANSWER_ON_PAGE,
                            },
                          },
                        ],
                      },
                    },
                    {
                      expressionGroup: {
                        expressions: [
                          {
                            left: {
                              type: "Null",
                              nullReason: NO_ROUTABLE_ANSWER_ON_PAGE,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      });

      const page = questionnaire.sections[0].pages[0];
      const expression1 = page.routing.rules[0].expressionGroup.expressions[0];
      const expression2 = page.routing.rules[1].expressionGroup.expressions[0];
      answer = page.answers[0];

      const insertedRows = await LeftSideRepository.setMissingDefaults(answer);

      expect(insertedRows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            expressionId: expression1.id,
            type: "Answer",
            answerId: answer.id,
          }),
          expect.objectContaining({
            expressionId: expression2.id,
            type: "Answer",
            answerId: answer.id,
          }),
        ])
      );
      const readLeft1 = await LeftSideRepository.getByExpressionId(
        expression1.id
      );
      expect(readLeft1.answerId).toEqual(answer.id);
      const readLeft2 = await LeftSideRepository.getByExpressionId(
        expression2.id
      );
      expect(readLeft2.answerId).toEqual(answer.id);
    });

    it("should not update non-Null Left Sides", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  { id: "answer1", type: answerTypes.NUMBER },
                  { type: answerTypes.NUMBER },
                ],
                routing: {
                  rules: [
                    {
                      expressionGroup: {
                        expressions: [
                          {
                            left: {
                              answerId: "answer1",
                            },
                          },
                        ],
                      },
                    },
                    {
                      expressionGroup: {
                        expressions: [
                          {
                            left: {
                              type: "Null",
                              nullReason: NO_ROUTABLE_ANSWER_ON_PAGE,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      });

      const page = questionnaire.sections[0].pages[0];
      const expression1 = page.routing.rules[0].expressionGroup.expressions[0];
      const expression2 = page.routing.rules[1].expressionGroup.expressions[0];
      answer = page.answers[0];
      const answer2 = page.answers[1];

      await LeftSideRepository.setMissingDefaults(answer2);
      const readLeft1 = await LeftSideRepository.getByExpressionId(
        expression1.id
      );
      expect(readLeft1.answerId).toEqual(answer.id);
      const readLeft2 = await LeftSideRepository.getByExpressionId(
        expression2.id
      );
      expect(readLeft2.answerId).toEqual(answer2.id);
    });
  });
});
