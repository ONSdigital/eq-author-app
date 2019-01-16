const knex = require("knex")(require("../knexfile"));
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);
const answerTypes = require("../constants/answerTypes");

const RightSideRepository = require("./RightSide2Repository")(knex);

describe("Right Side Repository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());

  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  let expression;
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
  });

  describe("insert", () => {
    it("should insert a right side for the expression with a custom value", async () => {
      const rightSide = await RightSideRepository.insert({
        expressionId: expression.id,
        customValue: { number: 42 },
        type: "Custom",
      });
      expect(rightSide).toMatchObject({
        id: expect.any(Number),
        expressionId: expression.id,
        customValue: { number: 42 },
        type: "Custom",
      });
    });
  });

  describe("getByExpressionId", () => {
    it("should return the right side expression for the expression id", async () => {
      const rightSide = await RightSideRepository.insert({
        expressionId: expression.id,
        customValue: { number: 42 },
        type: "Custom",
      });

      const readRightSide = await RightSideRepository.getByExpressionId(
        expression.id
      );
      expect(readRightSide).toMatchObject({
        id: rightSide.id,
      });
    });
  });

  describe("deleteByExpressionId", () => {
    it("should delete the rightSide for an expressionId", async () => {
      await RightSideRepository.insert({
        expressionId: expression.id,
        customValue: { number: 42 },
        type: "Custom",
      });

      await RightSideRepository.deleteByExpressionId(expression.id);

      const readRightSide = await RightSideRepository.getByExpressionId(
        expression.id
      );
      expect(readRightSide).toBeUndefined();
    });
  });

  describe("update", () => {
    it("should be able to update the type and custom value", async () => {
      const rightSide = await RightSideRepository.insert({
        expressionId: expression.id,
        type: "SelectedOptions",
      });

      const updateRightSide = await RightSideRepository.update({
        id: rightSide.id,
        type: "Custom",
        customValue: { number: 42 },
      });

      expect(updateRightSide).toMatchObject({
        id: rightSide.id,
        type: "Custom",
        customValue: { number: 42 },
      });
    });
  });
});
