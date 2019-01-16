const knex = require("knex")(require("../../../../knexfile"));
const executeQuery = require("../../../../tests/utils/executeQuery");
const buildTestQuestionnaire = require("../../../../tests/utils/buildTestQuestionnaire")(
  knex
);
const repositories = require("../../../../repositories")(knex);
const modifiers = require("../../../../modifiers")(repositories);
const { AND, OR } = require("../../../../constants/routingOperators");

const ctx = { repositories, modifiers };

describe("Expression group Integration", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());
  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  it("can update the operator on an expression Group", async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              routing: {
                rules: [
                  {
                    expressionGroup: {
                      operator: AND,
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    const expressionGroupId =
      questionnaire.sections[0].pages[0].routing.rules[0].expressionGroup.id;

    const updateExpressionGroup2 = `
      mutation updateExpressionGroup2($input: UpdateExpressionGroup2Input!) {
        updateExpressionGroup2(input: $input) {
          id
          operator
        }
      }
      `;

    const updateResult = await executeQuery(
      updateExpressionGroup2,
      { input: { id: expressionGroupId, operator: OR } },
      ctx
    );

    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toMatchObject({
      updateExpressionGroup2: {
        id: expressionGroupId.toString(),
        operator: OR,
      },
    });
  });
});
