const knex = require("knex")(require("../../../config/knexfile"));
const executeQuery = require("../../../tests/utils/executeQuery");
const buildTestQuestionnaire = require("../../../tests/utils/buildTestQuestionnaire")(
  knex
);
const repositories = require("../../../repositories")(knex);
const modifiers = require("../../../modifiers")(repositories);
const answerTypes = require("../../../constants/answerTypes");
const { AND, OR } = require("../../../constants/routingOperators");
const conditions = require("../../../constants/routingConditions");

const ctx = { repositories, modifiers };

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
                        operator: AND
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
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
          operator: OR
        }
      });
    });

    it("can update a binary expression to selected options", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  { id: "numberAnswer", type: answerTypes.NUMBER },
                  {
                    type: answerTypes.RADIO,
                    options: [{ label: "option1" }, { label: "option2" }]
                  }
                ],
                routing: {
                  rules: [
                    {
                      expressionGroup: {
                        operator: AND,
                        expressions: [
                          {
                            left: { answerId: "numberAnswer" }
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

      const page = questionnaire.sections[0].pages[0];
      const answer = page.answers[1];
      const optionIds = answer.options.map(({ id }) => id);
      const options = answer.options.map(({ id, label }) => ({
        id: id.toString(),
        label
      }));
      const expressionId =
        page.routing.rules[0].expressionGroup.expressions[0].id;

      const updateBinaryExpressionMutation = `
      mutation updateBinaryExpression2($input: UpdateBinaryExpression2Input!) {
        updateBinaryExpression2(input: $input) {
          id
          left{
            ...on MultipleChoiceAnswer{
              id
            }
          }  
          condition
          right {
            ...on SelectedOptions2 {
              options {
                id
                label
              }
            }
          }
        }
      }
      `;

      const updateResult = await executeQuery(
        updateBinaryExpressionMutation,
        {
          input: {
            id: expressionId,
            left: { answerId: answer.id },
            condition: conditions.ONE_OF,
            right: { selectedOptions: optionIds }
          }
        },
        ctx
      );

      expect(updateResult.errors).toBeUndefined();
      expect(updateResult.data).toMatchObject({
        updateBinaryExpression2: {
          id: expressionId.toString(),
          left: { id: answer.id.toString() },
          condition: conditions.ONE_OF,
          right: {
            options
          }
        }
      });
    });

    it("can update a binary expression to a custom value", async () => {
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
                      { id: "option2", label: "option2" }
                    ]
                  }
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
                              selectedOptions: ["option1", "option2"]
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

      const page = questionnaire.sections[0].pages[0];
      const answer = page.answers[0];
      const expressionId =
        page.routing.rules[0].expressionGroup.expressions[0].id;

      const updateBinaryExpressionMutation = `
        mutation updateBinaryExpression2($input: UpdateBinaryExpression2Input!) {
          updateBinaryExpression2(input: $input) {
            id
            left{
              ...on BasicAnswer{
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
        `;

      const updateResult = await executeQuery(
        updateBinaryExpressionMutation,
        {
          input: {
            id: expressionId,
            left: { answerId: answer.id },
            condition: conditions.GREATER_THAN,
            right: {
              customValue: {
                number: 5
              }
            }
          }
        },
        ctx
      );

      expect(updateResult.errors).toBeUndefined();
      expect(JSON.parse(JSON.stringify(updateResult.data))).toMatchObject({
        updateBinaryExpression2: {
          id: expressionId.toString(),
          left: { id: answer.id.toString() },
          condition: conditions.GREATER_THAN,
          right: {
            number: 5
          }
        }
      });
    });
  });

  describe("Routing Delete operations", () => {
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
                      { id: "option2", label: "option2" }
                    ]
                  }
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
                              selectedOptions: ["option1", "option2"]
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

      const page = questionnaire.sections[0].pages[0];
      const routingRuleId = page.routing.rules[0].id;

      const deleteRoutingRuleMutation = `
        mutation deleteRoutingRule2($input: DeleteRoutingRule2Input!) {
          deleteRoutingRule2(input: $input) {
            id
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
            rules {
              id
            }
          }
        }
      }
        `;

      const readResult = await executeQuery(readRoutingTreeQuery, {}, ctx);

      expect(readResult.data.questionPage.routing.rules).toHaveLength(0);
    });
    it("can delete a Binary Expression", async () => {
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
                      { id: "option2", label: "option2" }
                    ]
                  }
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
                              selectedOptions: ["option1", "option2"]
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

      const page = questionnaire.sections[0].pages[0];
      const expressionId =
        page.routing.rules[0].expressionGroup.expressions[0].id;

      const deleteBinaryExpressionMutation = `
        mutation deleteBinaryExpression2($input: DeleteBinaryExpression2Input!) {
          deleteBinaryExpression2(input: $input) {
            id
          }
        }
        `;

      const deleteResult = await executeQuery(
        deleteBinaryExpressionMutation,
        { input: { id: expressionId } },
        ctx
      );

      expect(deleteResult.errors).toBeUndefined();

      const readRoutingTreeQuery = `
      query GetPage {
        questionPage(id: ${page.id}) {
          routing {
            rules {
              expressionGroup{
                  expressions{
                    ...on BinaryExpression2{
                    id
                  }
                }
              }
            }
          }
        }
      }
        `;

      const readResult = await executeQuery(readRoutingTreeQuery, {}, ctx);
      expect(
        readResult.data.questionPage.routing.rules[0].expressionGroup
          .expressions
      ).toHaveLength(0);
    });
  });
});
