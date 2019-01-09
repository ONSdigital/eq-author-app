const knex = require("knex")(require("../../../config/knexfile"));
const executeQuery = require("../../../tests/utils/executeQuery");
const buildTestQuestionnaire = require("../../../tests/utils/buildTestQuestionnaire")(
  knex
);
const repositories = require("../../../repositories")(knex);
const modifiers = require("../../../modifiers")(repositories);
const answerTypes = require("../../../constants/answerTypes");
const conditions = require("../../../constants/routingConditions");

const ctx = { repositories, modifiers };

describe("answer", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());
  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });
  describe("routing", () => {
    it("should update all LeftSides for existing Rules on the Page when it is the first Answer for the Page", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [],
                routing: {
                  else: {
                    logical: "NextPage"
                  },
                  rules: [
                    {
                      destination: {
                        logical: "NextPage"
                      },
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

      const createAnswerMutation = `
        mutation CreateAnswer($input: CreateAnswerInput!) {
          createAnswer(input: $input) {
            id
            page {
              routing {
                rules {
                  expressionGroup {
                    expressions { 
                      ...on BinaryExpression2 {
                        left {
                          ...on BasicAnswer {
                            id
                          }
                        }
                        condition
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const createResult = await executeQuery(
        createAnswerMutation,
        {
          input: { questionPageId: page.id, type: answerTypes.NUMBER }
        },
        ctx
      );

      expect(createResult.errors).toBeUndefined();
      const answerId = createResult.data.createAnswer.id;
      const expression =
        createResult.data.createAnswer.page.routing.rules[0].expressionGroup
          .expressions[0];
      expect(expression).toMatchObject({
        left: { id: answerId },
        condition: conditions.EQUAL
      });
    });

    it("should delete all sides if a referenced answer is deleted", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [{ id: "answer", type: answerTypes.NUMBER }],
                routing: {
                  else: {
                    logical: "NextPage"
                  },
                  rules: [
                    {
                      destination: {
                        logical: "NextPage"
                      },
                      expressionGroup: {
                        expressions: [
                          {
                            left: { answerId: "answer" },
                            condition: conditions.EQUAL,
                            right: { customValue: { number: 5 } }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      });
      const answer = questionnaire.sections[0].pages[0].answers[0];

      const deleteAnswerMutation = `
        mutation DeleteAnswer($input: DeleteAnswerInput!) {
          deleteAnswer(input: $input) {
            id
            page {
              routing {
                rules {
                  expressionGroup {
                    expressions { 
                      ...on BinaryExpression2 {
                        left {
                          ...on BasicAnswer {
                            id
                          }
                        }
                        condition
                        right {
                          ...on CustomValue2 {
                            number
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const deleteResult = await executeQuery(
        deleteAnswerMutation,
        {
          input: { id: answer.id }
        },
        ctx
      );

      expect(deleteResult.errors).toBeUndefined();
      expect(deleteResult.data.deleteAnswer).toMatchObject({
        page: {
          routing: {
            rules: [
              {
                expressionGroup: {
                  expressions: [
                    {
                      left: null,
                      condition: conditions.EQUAL,
                      right: null
                    }
                  ]
                }
              }
            ]
          }
        }
      });
    });
  });
});
