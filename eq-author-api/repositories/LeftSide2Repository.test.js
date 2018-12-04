const db = require("../db");
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  db
);
const answerTypes = require("../constants/answerTypes");

const LeftSideRepository = require("./LeftSide2Repository")(db);

describe("Left Side Repository", () => {
  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());

  afterEach(async () => {
    await db.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  let expression;
  let answer;
  beforeEach(async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              answers: [
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
  });

  describe("insert", () => {
    it("should create an expression side for the expression", async () => {
      const binaryExpression = await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id
      });
      expect(binaryExpression).toMatchObject({
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

  describe("getByExpressionId", () => {
    it("should return the left side expression for the expression id", async () => {
      const binaryExpression = await LeftSideRepository.insert({
        expressionId: expression.id,
        answerId: answer.id
      });
      const readExpression = await LeftSideRepository.getByExpressionId(
        expression.id
      );
      expect(readExpression).toMatchObject({
        id: binaryExpression.id
      });
    });
  });
});
