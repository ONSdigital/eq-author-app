const knex = require("knex")(require("../knexfile"));
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);
const { AND, OR } = require("../constants/routingOperators");

const ExpressionGroupRepository = require("./ExpressionGroup2Repository")(knex);

describe("Expression Group Repository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());

  afterEach(async () => {
    await knex.transaction(async trx => {
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
                rules: [{}],
              },
            },
          ],
        },
      ],
    });
    rule = questionnaire.sections[0].pages[0].routing.rules[0];
  });

  describe("insert", () => {
    it("should create a group", async () => {
      const group = await ExpressionGroupRepository.insert({ ruleId: rule.id });
      expect(group).toMatchObject({
        id: expect.any(Number),
        ruleId: rule.id,
        operator: AND,
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
    it("should return the expression group for the id", async () => {
      const group = await ExpressionGroupRepository.insert({ ruleId: rule.id });
      const readGroup = await ExpressionGroupRepository.getById(group.id);
      expect(readGroup).toMatchObject(group);
    });
  });

  describe("update", () => {
    it("should update the expression group operator", async () => {
      const group = await ExpressionGroupRepository.insert({ ruleId: rule.id });
      const updatedGroup = await ExpressionGroupRepository.update({
        id: group.id,
        operator: OR,
      });
      expect(updatedGroup).toMatchObject({ ...group, operator: OR });
    });
  });
});
