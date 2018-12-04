const db = require("../db");
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  db
);

const BinaryExpressionRepository = require("./BinaryExpression2Repository")(db);

describe("Binary Expression Repository", () => {
  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());

  afterEach(async () => {
    await db.transaction(async trx => {
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
                    expressionGroup: {}
                  }
                ]
              }
            }
          ]
        }
      ]
    });
    expressionGroup =
      questionnaire.sections[0].pages[0].routing.rules[0].expressionGroup;
  });

  describe("insert", () => {
    it("should create a binary expression", async () => {
      const binaryExpression = await BinaryExpressionRepository.insert({
        groupId: expressionGroup.id
      });
      expect(binaryExpression).toMatchObject({
        id: expect.any(Number),
        expressionGroupId: expressionGroup.id,
        condition: "Equal"
      });
    });
  });

  describe("getByExpressionGroupId", () => {
    it("should return the binary expressions for the expression group", async () => {
      const binaryExpression = await BinaryExpressionRepository.insert({
        groupId: expressionGroup.id
      });
      const expressions = await BinaryExpressionRepository.getByExpressionGroupId(
        expressionGroup.id
      );
      expect(expressions).toEqual([
        expect.objectContaining({
          id: binaryExpression.id
        })
      ]);
    });
  });
});
