const db = require("../db");
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  db
);

const ExpressionGroupRepository = require("./ExpressionGroup2Repository")(db);

describe("Expression Group Repository", () => {
  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());

  afterEach(async () => {
    await db.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  let rule;
  beforeEach(async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              routing: {
                rules: [{}]
              }
            }
          ]
        }
      ]
    });
    rule = questionnaire.sections[0].pages[0].routing.rules[0];
  });

  describe("insert", () => {
    it("should create a group", async () => {
      const group = await ExpressionGroupRepository.insert({ ruleId: rule.id });
      expect(group).toMatchObject({
        id: expect.any(Number),
        ruleId: rule.id,
        operator: "And"
      });
    });
  });

  describe("getByRuleId", () => {
    it("should return the expression group for the rule", async () => {
      const group = await ExpressionGroupRepository.insert({ ruleId: rule.id });
      const readGroup = await ExpressionGroupRepository.getByRuleId(rule.id);
      expect(readGroup).toMatchObject(group);
    });
  });

  describe("getById", () => {
    it("shold return the expression group for the id", async () => {
      const group = await ExpressionGroupRepository.insert({ ruleId: rule.id });
      const readGroup = await ExpressionGroupRepository.getById(group.id);
      expect(readGroup).toMatchObject(group);
    });
  });
});
