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
const {
  NO_ROUTABLE_ANSWER_ON_PAGE,
} = require("../../../../constants/routingNoLeftSide");

const ctx = { repositories, modifiers };

describe("BinaryExpression Integration", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());
  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
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
                  type: answerTypes.NUMBER,
                },
              ],
              routing: {
                else: {
                  logical: "NextPage",
                },
                rules: [
                  {
                    destination: {
                      logical: "NextPage",
                    },
                    expressionGroup: {
                      expressions: [
                        {
                          left: {
                            answerId: "a1",
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
      expressionGroupId,
    };
    const createResult = await executeQuery(createMutation, { input }, ctx);
    expect(createResult.errors).toBeUndefined();
    expect(createResult.data).toMatchObject({
      createBinaryExpression2: {
        id: expect.any(String),
        expressionGroup: { id: expressionGroupId.toString() },
      },
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

  it("should create a 'Null' left hand side when no answer on page", async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              answers: [],
              routing: {
                else: {
                  logical: "NextPage",
                },
                rules: [
                  {
                    destination: {
                      logical: "NextPage",
                    },
                    expressionGroup: {
                      expressions: [],
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    const createMutation = `
    mutation createBinaryExpression2($input: CreateBinaryExpression2Input!) {
      createBinaryExpression2(input: $input) {
        left {
          ...on BasicAnswer{
            id
          }
          ...on NoLeftSide {
            reason
          }
        }
        condition 
      }
    }`;
    const page = questionnaire.sections[0].pages[0];
    const expressionGroupId = page.routing.rules[0].expressionGroup.id;
    const input = {
      expressionGroupId,
    };
    const createResult = await executeQuery(createMutation, { input }, ctx);

    expect(createResult.errors).toBeUndefined();
    expect(createResult.data).toMatchObject({
      createBinaryExpression2: {
        left: { reason: NO_ROUTABLE_ANSWER_ON_PAGE },
        condition: conditions.EQUAL,
      },
    });
  });

  it("should not return selected options that have been deleted", async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              answers: [
                {
                  id: "radioAnswer",
                  type: answerTypes.RADIO,
                  options: [
                    { id: "1", label: "option1" },
                    { id: "2", label: "option2" },
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
                            selectedOptions: ["1", "2"],
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
    const option1 = page.answers[0].options[0];
    const option2 = page.answers[0].options[1];

    const deleteOptionQuery = `
    mutation DeleteOption($input: DeleteOptionInput!) {
      deleteOption(input: $input) {
        id
        __typename
      }
    }
    `;
    await executeQuery(deleteOptionQuery, { input: { id: option1.id } }, ctx);

    const readRoutingTreeQuery = `
    query GetPage {
      questionPage(id: ${page.id}) {
        routing {
          rules {
            expressionGroup{
                expressions{
                  ...on BinaryExpression2{
                  id
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
            }
          }
        }
      }
    }
      `;

    const read = await executeQuery(readRoutingTreeQuery, {}, ctx);
    const result =
      read.data.questionPage.routing.rules[0].expressionGroup.expressions[0]
        .right;
    expect(result.options).toHaveLength(1);
    expect(result.options[0]).toMatchObject({
      id: option2.id.toString(),
      label: option2.label,
    });
  });

  it("can update the left side to a new answer", async () => {
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
    const answer = page.answers[0];
    const expressionId =
      page.routing.rules[0].expressionGroup.expressions[0].id;

    const updateLeftSideMutation = `
      mutation updateLeftSide2($input: UpdateLeftSide2Input!) {
        updateLeftSide2(input: $input) {
          id
          left {
            ...on BasicAnswer{
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
      updateLeftSideMutation,
      {
        input: {
          expressionId: expressionId,
          answerId: answer.id,
        },
      },
      ctx
    );

    expect(updateResult.errors).toBeUndefined();
    expect(JSON.parse(JSON.stringify(updateResult.data))).toMatchObject({
      updateLeftSide2: {
        id: expressionId.toString(),
        left: { id: answer.id.toString() },
        condition: conditions.EQUAL,
        right: {},
      },
    });
  });

  it("can update the right side to a new array of options", async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [
            {
              answers: [
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
                          right: {},
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
    const answer = page.answers[0];
    const optionIds = answer.options.map(({ id }) => id);
    const options = answer.options.map(({ id, label }) => ({
      id: id.toString(),
      label,
    }));
    const expressionId =
      page.routing.rules[0].expressionGroup.expressions[0].id;

    const updateRightSideMutation = `
      mutation updateRightSide2($input: UpdateRightSide2Input!) {
        updateRightSide2(input: $input) {
          id
          left {
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
      updateRightSideMutation,
      {
        input: {
          expressionId: expressionId,
          selectedOptions: optionIds,
        },
      },
      ctx
    );

    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toMatchObject({
      updateRightSide2: {
        id: expressionId.toString(),
        left: { id: answer.id.toString() },
        condition: conditions.ONE_OF,
        right: { options },
      },
    });
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
      readResult.data.questionPage.routing.rules[0].expressionGroup.expressions
    ).toHaveLength(0);
  });
});
