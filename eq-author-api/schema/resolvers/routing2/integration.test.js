const knex = require("../../../db");
const executeQuery = require("../../../tests/utils/executeQuery");
const buildTestQuestionnaire = require("../../../tests/utils/buildTestQuestionnaire")(
  knex
);
const repositories = require("../../../repositories")(knex);
const answerTypes = require("../../../constants/answerTypes");

const ctx = { repositories };

describe("Routing2 Integration", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());
  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  describe("Routing create operations", () => {
    it("should create a Routing2", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: answerTypes.NUMBER
                  }
                ]
              }
            ]
          }
        ]
      });
      const createMutation = `
      mutation createRouting2($input: CreateRouting2Input!) {
        createRouting2(input: $input) {
          id
          page {
            id
          }
        }
      }`;
      const page = questionnaire.sections[0].pages[0];
      const pageId = page.id;
      const input = {
        pageId
      };
      const createResult = await executeQuery(createMutation, { input }, ctx);
      expect(createResult.errors).toBeUndefined();
      expect(createResult.data).toMatchObject({
        createRouting2: {
          id: expect.any(String),
          page: { id: pageId.toString() }
        }
      });

      const query = `
      query($pageId: ID!) {
        page(id: $pageId) {
          ... on QuestionPage {
            routing {
              id
              page {
                id
              }
              else {
                ...Destination2
              }
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
                        ... on BasicAnswer {
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

      const readResult = await executeQuery(query, { pageId }, ctx);
      expect(readResult.errors).toBeUndefined();
      expect(readResult.data).toMatchObject({
        page: {
          routing: {
            id: createResult.data.createRouting2.id,
            page: { id: pageId.toString() },
            else: {
              id: expect.any(String),
              logical: "NextPage",
              page: null,
              section: null
            },
            rules: [
              {
                id: expect.any(String),
                destination: {
                  id: expect.any(String),
                  logical: "NextPage",
                  page: null,
                  section: null
                },
                expressionGroup: {
                  id: expect.any(String),
                  operator: "And",
                  expressions: [
                    {
                      id: expect.any(String),
                      left: {
                        id: page.answers[0].id.toString()
                      },
                      condition: "Equal",
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

    it("should create a RoutingRule with default expression group", async () => {
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
                  else: {
                    logical: "NextPage"
                  }
                }
              }
            ]
          }
        ]
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
        routingId: routing.id
      };
      const createResult = await executeQuery(createMutation, { input }, ctx);
      expect(createResult.errors).toBeUndefined();
      expect(createResult.data).toMatchObject({
        createRoutingRule2: {
          id: expect.any(String),
          routing: { id: routing.id.toString() }
        }
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
                        ... on BasicAnswer {
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
                  section: null
                },
                expressionGroup: {
                  id: expect.any(String),
                  operator: "And",
                  expressions: [
                    {
                      id: expect.any(String),
                      left: {
                        id: page.answers[0].id.toString()
                      },
                      condition: "Equal",
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

    it("should create a BinaryExpression with default left side", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    id: "a1",
                    type: answerTypes.NUMBER
                  }
                ],
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
                            left: {
                              answerId: "a1"
                            }
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
      const createMutation = `
    mutation createBinaryExpression2($input: CreateBinaryExpression2Input!) {
      createBinaryExpression2(input: $input) {
        id
        expressionGroup {
          id
        }
      }
    }`;
      const page = questionnaire.sections[0].pages[0];
      const expressionGroupId = page.routing.rules[0].expressionGroup.id;
      const input = {
        expressionGroupId
      };
      const createResult = await executeQuery(createMutation, { input }, ctx);
      expect(createResult.errors).toBeUndefined();
      expect(createResult.data).toMatchObject({
        createBinaryExpression2: {
          id: expect.any(String),
          expressionGroup: { id: expressionGroupId.toString() }
        }
      });

      const query = `
      query($pageId: ID!) {
        page(id: $pageId) {
          ... on QuestionPage {
            routing {
              rules {
                expressionGroup {
                  id
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
                        ... on BasicAnswer {
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
    `;

      const readResult = await executeQuery(query, { pageId: page.id }, ctx);
      expect(readResult.errors).toBeUndefined();
      expect(readResult.data).toMatchObject({
        page: {
          routing: {
            rules: [
              {
                expressionGroup: {
                  id: expressionGroupId.toString(),
                  expressions: [
                    expect.any(Object),
                    {
                      id: createResult.data.createBinaryExpression2.id,
                      left: {
                        id: page.answers[0].id.toString()
                      },
                      condition: "Equal",
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

  describe("Routing update operations", () => {
    it("can update a routing destination on a routing2", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                routing: {
                  else: {
                    logical: "NextPage"
                  }
                }
              }
            ]
          },
          { pages: [] }
        ]
      });

      const updateRouting2Mutation = `
      mutation updateRouting2($input: UpdateRouting2Input!) {
        updateRouting2(input: $input) {
          id
          else {
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

      const routingId = questionnaire.sections[0].pages[0].routing.id;
      const sectionDestinationId = questionnaire.sections[1].id;

      const updateResult = await executeQuery(
        updateRouting2Mutation,
        { input: { id: routingId, else: { sectionId: sectionDestinationId } } },
        ctx
      );

      expect(updateResult.errors).toBeUndefined();
      expect(updateResult.data).toMatchObject({
        updateRouting2: {
          id: routingId.toString(),
          else: {
            logical: null,
            page: null,
            section: {
              id: sectionDestinationId.toString()
            }
          }
        }
      });
    });

    it("can update a routing destination on a routingRule2", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                routing: {
                  else: {
                    logical: "NextPage"
                  },
                  rules: [
                    {
                      destination: {
                        logical: "NextPage"
                      }
                    }
                  ]
                }
              },
              {}
            ]
          }
        ]
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
            destination: { pageId: pageDestinationId }
          }
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
              id: pageDestinationId.toString()
            },
            section: null
          }
        }
      });
    });
  });
});
