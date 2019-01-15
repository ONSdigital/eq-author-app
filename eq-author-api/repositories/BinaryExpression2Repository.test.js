const knex = require("knex")(require("../knexfile"));
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);
const routingConditions = require("../constants/routingConditions");

const BinaryExpressionRepository = require("./BinaryExpression2Repository")(
  knex
);

describe("Binary Expression Repository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());

  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  let expressionGroup;
  beforeEach(async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              routing: {
                rules: [
                  {
                    expressionGroup: {},
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    expressionGroup =
      questionnaire.sections[0].pages[0].routing.rules[0].expressionGroup;
  });

  describe("insert", () => {
    it("should create a binary expression", async () => {
      const binaryExpression = await BinaryExpressionRepository.insert({
        groupId: expressionGroup.id,
      });
      expect(binaryExpression).toMatchObject({
        id: expect.any(Number),
        expressionGroupId: expressionGroup.id,
        condition: "Equal",
      });
    });
  });

  describe("update", () => {
    it("should update the condition on a Binary Expression", async () => {
      const binaryExpression = await BinaryExpressionRepository.insert({
        groupId: expressionGroup.id,
      });

      const updateResult = await BinaryExpressionRepository.update({
        id: binaryExpression.id,
        condition: routingConditions.ONE_OF,
      });

      expect(updateResult).toEqual({
        id: binaryExpression.id,
        expressionGroupId: expressionGroup.id,
        condition: routingConditions.ONE_OF,
      });
    });
  });

  describe("getById", () => {
    it("should get Binary expression by Id", async () => {
      const binaryExpression = await BinaryExpressionRepository.insert({
        groupId: expressionGroup.id,
      });
      const expression = await BinaryExpressionRepository.getById(
        binaryExpression.id
      );
      expect(expression).toEqual(
        expect.objectContaining({
          id: binaryExpression.id,
        })
      );
    });
  });

  describe("getByExpressionGroupId", () => {
    it("should return the binary expressions for the expression group", async () => {
      const binaryExpression = await BinaryExpressionRepository.insert({
        groupId: expressionGroup.id,
      });
      const expressions = await BinaryExpressionRepository.getByExpressionGroupId(
        expressionGroup.id
      );
      expect(expressions).toEqual([
        expect.objectContaining({
          id: binaryExpression.id,
        }),
      ]);
    });
  });

  describe("delete", () => {
    it("should delete the binary expreesion returning deleted object", async () => {
      const binaryExpression = await BinaryExpressionRepository.insert({
        groupId: expressionGroup.id,
      });
      const deleteResult = await BinaryExpressionRepository.delete(
        binaryExpression.id
      );

      expect(deleteResult).toMatchObject(binaryExpression);
    });
  });
});
