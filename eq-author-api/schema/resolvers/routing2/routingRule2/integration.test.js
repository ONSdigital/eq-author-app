const knex = require("knex")(require("../../../../knexfile"));
const executeQuery = require("../../../../tests/utils/executeQuery");
const buildTestQuestionnaire = require("../../../../tests/utils/buildTestQuestionnaire")(
  knex
);
const repositories = require("../../../../repositories")(knex);
const modifiers = require("../../../../modifiers")(repositories);
const answerTypes = require("../../../../constants/answerTypes");
const { AND } = require("../../../../constants/routingOperators");
const conditions = require("../../../../constants/routingConditions");

const ctx = { repositories, modifiers };

describe("RoutingRule Integration", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());
  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  it("should create a RoutingRule with default expression group", async () => {
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
                else: {
                  logical: "NextPage",
                },
              },
            },
          ],
        },
      ],
    });
    const createMutation = `
    mutation createRoutingRule2($input: CreateRoutingRule2Input!) {
      createRoutingRule2(input: $input) {
        id
        routing {
          id
        }
      }
    }`;
    const page = questionnaire.sections[0].pages[0];
    const routing = page.routing;
    const input = {
      routingId: routing.id,
    };
    const createResult = await executeQuery(createMutation, { input }, ctx);
    expect(createResult.errors).toBeUndefined();
    expect(createResult.data).toMatchObject({
      createRoutingRule2: {
        id: expect.any(String),
        routing: { id: routing.id.toString() },
      },
    });

    const query = `
      query($pageId: ID!) {
        page(id: $pageId) {
          ... on QuestionPage {
            routing {
              id
              rules {
                id
                destination {
                  ...Destination2
                }
                expressionGroup {
                  id
                  operator
                  expressions {
                    ... on BinaryExpression2 {
                      id
                      left {
                        ... on BasicAnswer {
                          id
                        }
                      }
                      condition
                      right {
                        ... on CustomValue2 {
                          number
                        }
                        ... on SelectedOptions2 {
                          options {
                            id
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
      }

      fragment Destination2 on Destination2 {
        id
        page {
          id
        }
        section {
          id
        }
        logical
      }
    `;

    const readResult = await executeQuery(query, { pageId: page.id }, ctx);
    expect(readResult.errors).toBeUndefined();
    expect(readResult.data).toMatchObject({
      page: {
        routing: {
          id: routing.id.toString(),
          rules: [
            {
              id: createResult.data.createRoutingRule2.id,
              destination: {
                id: expect.any(String),
                logical: "NextPage",
                page: null,
                section: null,
              },
              expressionGroup: {
                id: expect.any(String),
                operator: "And",
                expressions: [
                  {
                    id: expect.any(String),
                    left: {
                      id: page.answers[0].id.toString(),
                    },
                    condition: "Equal",
                    right: null,
                  },
                ],
              },
            },
          ],
        },
      },
    });
  });

  describe("update", () => {
    it("can set the destination to a valid destination", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                routing: {
                  else: {
                    logical: "NextPage",
                  },
                  rules: [
                    {
                      destination: {
                        logical: "NextPage",
                      },
                    },
                  ],
                },
              },
              {},
            ],
          },
        ],
      });

      const updateRoutingRule2Mutation = `
        mutation updateRoutingRule2($input: UpdateRoutingRule2Input!) {
          updateRoutingRule2(input: $input) {
            id
            destination {
              logical
              page {
                id
              }
              section {
                id
              }
            }
          }
        }`;

      const routingRuleId =
        questionnaire.sections[0].pages[0].routing.rules[0].id;
      const pageDestinationId = questionnaire.sections[0].pages[1].id;

      const updateResult = await executeQuery(
        updateRoutingRule2Mutation,
        {
          input: {
            id: routingRuleId,
            destination: { pageId: pageDestinationId },
          },
        },
        ctx
      );

      expect(updateResult.errors).toBeUndefined();
      expect(updateResult.data).toMatchObject({
        updateRoutingRule2: {
          id: routingRuleId.toString(),
          destination: {
            logical: null,
            page: {
              id: pageDestinationId.toString(),
            },
            section: null,
          },
        },
      });
    });

    it("errors when the destination is not valid", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                routing: {
                  else: {
                    logical: "NextPage",
                  },
                  rules: [
                    {
                      destination: {
                        logical: "NextPage",
                      },
                    },
                  ],
                },
              },
              {},
            ],
          },
          {
            pages: [{}],
          },
        ],
      });

      const routingRuleId =
        questionnaire.sections[0].pages[0].routing.rules[0].id;
      const pageInNextSectionId = questionnaire.sections[1].pages[0].id;

      const updateRoutingRule2Mutation = `
        mutation updateRoutingRule2($input: UpdateRoutingRule2Input!) {
          updateRoutingRule2(input: $input) {
            id
          }
        }`;

      const updateResult = await executeQuery(
        updateRoutingRule2Mutation,
        {
          input: {
            id: routingRuleId,
            destination: { pageId: pageInNextSectionId },
          },
        },
        ctx
      );

      expect(updateResult.errors).not.toBeUndefined();
      expect(updateResult.errors[0].message).toMatch(
        "The provided desination is invalid"
      );
    });
  });

  describe("delete", () => {
    it("can delete a routingRule", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  { type: answerTypes.NUMBER },
                  {
                    id: "radioAnswer",
                    type: answerTypes.RADIO,
                    options: [
                      { id: "option1", label: "option1" },
                      { id: "option2", label: "option2" },
                    ],
                  },
                ],
                routing: {
                  rules: [
                    {
                      expressionGroup: {
                        operator: AND,
                        expressions: [
                          {
                            left: { answerId: "radioAnswer" },
                            condition: conditions.ONE_OF,
                            right: {
                              type: "SelectedOptions",
                              selectedOptions: ["option1", "option2"],
                            },
                          },
                        ],
                      },
                    },
                    {
                      expressionGroup: {
                        operator: AND,
                        expressions: [
                          {
                            left: { answerId: "radioAnswer" },
                            condition: conditions.ONE_OF,
                            right: {
                              type: "SelectedOptions",
                              selectedOptions: ["option1", "option2"],
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
      const routingRuleId = page.routing.rules[0].id;

      const deleteRoutingRuleMutation = `
        mutation deleteRoutingRule2($input: DeleteRoutingRule2Input!) {
          deleteRoutingRule2(input: $input) {
            id
            rules {
              id
            }
          }
        }
        `;

      const deleteResult = await executeQuery(
        deleteRoutingRuleMutation,
        { input: { id: routingRuleId } },
        ctx
      );

      expect(deleteResult.errors).toBeUndefined();
      expect(deleteResult.data.deleteRoutingRule2).toMatchObject({
        rules: [
          expect.objectContaining({ id: page.routing.rules[1].id.toString() }),
        ],
      });

      const readRoutingTreeQuery = `
      query GetPage($id: ID!) {
        questionPage(id: $id) {
          id
          routing {
            id
            rules {
              id
            }
          }
        }
      }
        `;

      const readResult = await executeQuery(
        readRoutingTreeQuery,
        { id: page.id },
        ctx
      );

      expect(readResult.data.questionPage.routing.rules).toHaveLength(1);
    });

    it("should delete the parent routing when the last rule is removed", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  { type: answerTypes.NUMBER },
                  {
                    id: "radioAnswer",
                    type: answerTypes.RADIO,
                    options: [
                      { id: "option1", label: "option1" },
                      { id: "option2", label: "option2" },
                    ],
                  },
                ],
                routing: {
                  rules: [
                    {
                      expressionGroup: {
                        operator: AND,
                        expressions: [
                          {
                            left: { answerId: "radioAnswer" },
                            condition: conditions.ONE_OF,
                            right: {
                              type: "SelectedOptions",
                              selectedOptions: ["option1", "option2"],
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
      const routingRuleId = page.routing.rules[0].id;

      const deleteRoutingRuleMutation = `
        mutation deleteRoutingRule2($input: DeleteRoutingRule2Input!) {
          deleteRoutingRule2(input: $input) {
            id
            rules {
              id
            }
          }
        }
        `;

      const deleteResult = await executeQuery(
        deleteRoutingRuleMutation,
        { input: { id: routingRuleId } },
        ctx
      );

      expect(deleteResult.errors).toBeUndefined();

      const readRoutingTreeQuery = `
      query GetPage {
        questionPage(id: ${page.id}) {
          id
          routing {
            id
          }
        }
      }
        `;

      const readResult = await executeQuery(readRoutingTreeQuery, {}, ctx);

      expect(readResult.data.questionPage.routing).toBe(null);
    });
  });
});
