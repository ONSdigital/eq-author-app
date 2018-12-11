const knex = require("knex")(require("../config/knexfile"));
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);
const answerTypes = require("../constants/answerTypes");

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
                  type: answerTypes.NUMBER
                },
                {
                  type: answerTypes.NUMBER
                }
              ],
              routing: {
                rules: [
                  {
                    expressionGroup: {
                      expressions: [{}]
                    }
                  }
                ]
              }
            }
          ]
        }
      ]
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
        answerId: answer.id
      });
      expect(leftSide).toMatchObject({
        id: expect.any(Number),
        expressionId: expression.id,
        answerId: answer.id,
        type: "Answer"
      });
    });

    it("should error when attempting to insert a second for an expression", async () => {
      await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id
      });
      try {
        await LeftSideRepository.insert({
          expressionId: expression.id,
          answerId: answer.id
        });
      } catch (e) {
        expect(e.message).toMatch(/unique constraint/);
        return;
      }
      expect(true).toBe(false);
    });
  });

  describe("update", () => {
    it("should update the left side to new answer", async () => {
      const leftSide = await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id
      });

      const updateResult = await LeftSideRepository.update({
        id: leftSide.id,
        answerId: secondAnswer.id
      });

      expect(updateResult).toMatchObject({
        id: leftSide.id,
        expressionId: expression.id,
        answerId: secondAnswer.id,
        type: "Answer"
      });
    });
  });

  describe("getByExpressionId", () => {
    it("should return the left side expression for the expression id", async () => {
      const leftSide = await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id
      });
      const readExpression = await LeftSideRepository.getByExpressionId(
        expression.id
      );
      expect(readExpression).toMatchObject({
        id: leftSide.id
      });
    });
  });
});
