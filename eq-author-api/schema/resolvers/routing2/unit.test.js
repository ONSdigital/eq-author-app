const executeQuery = require("../../../tests/utils/executeQuery");
const answerTypes = require("../../../constants/answerTypes");
const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE
} = require("../../../constants/logicalDestinations");

const ROUTING_ID = 1;
const ROUTING_RULE_ID = 2;
const FIRST_DESTINATION_ID = 3;
const SECOND_DESTINATION_ID = 4;
const EXPRESSION_GROUP_ID = 5;
const LEFT_SIDE_ID = 6;
const ANSWER_ID = 7;
const BINARY_EXPRESSION_ID = 8;
const PAGE_ID = 9;
const LATER_PAGE_ID = 10;
const LATER_SECTION_ID = 10;

describe("Routing2 Unit", () => {
  let ctx;
  beforeEach(() => {
    ctx = {
      repositories: {
        Routing2: {
          insert: jest.fn().mockResolvedValueOnce({
            id: ROUTING_ID,
            destinationId: FIRST_DESTINATION_ID
          }),
          getById: jest.fn().mockResolvedValue({
            id: ROUTING_ID,
            destinationId: FIRST_DESTINATION_ID
          })
        },
        Destination: {
          insert: jest
            .fn()
            .mockResolvedValueOnce({
              id: FIRST_DESTINATION_ID,
              logical: NEXT_PAGE
            })
            .mockResolvedValueOnce({
              id: SECOND_DESTINATION_ID,
              logical: NEXT_PAGE
            }),
          getById: jest.fn(id => {
            return Promise.resolve({ id, logical: NEXT_PAGE });
          }),
          update: jest.fn(input => Promise.resolve(input))
        },
        QuestionPage: {
          getById: jest.fn(id =>
            Promise.resolve({ id, pageType: "QuestionPage" })
          )
        },
        Section: {
          getById: jest.fn(id => Promise.resolve({ id }))
        },
        RoutingRule2: {
          insert: jest.fn(({ routingId, destinationId }) =>
            Promise.resolve({
              id: ROUTING_RULE_ID,
              routingId,
              destinationId
            })
          ),
          getByRoutingId: jest
            .fn()
            .mockResolvedValueOnce([
              { id: ROUTING_RULE_ID, destinationId: SECOND_DESTINATION_ID }
            ]),
          getById: jest.fn().mockResolvedValueOnce({
            id: ROUTING_RULE_ID,
            routingId: ROUTING_ID,
            destinationId: SECOND_DESTINATION_ID
          })
        },
        ExpressionGroup2: {
          insert: jest.fn().mockResolvedValueOnce({
            id: EXPRESSION_GROUP_ID,
            operator: "And"
          }),
          getByRuleId: jest.fn().mockResolvedValueOnce({
            id: EXPRESSION_GROUP_ID,
            operator: "And"
          }),
          getById: jest.fn().mockResolvedValue({
            id: EXPRESSION_GROUP_ID,
            operator: "And"
          })
        },
        Answer: {
          getFirstOnPage: jest.fn().mockResolvedValueOnce({
            id: ANSWER_ID,
            type: answerTypes.TEXTFIELD
          }),
          getById: jest.fn().mockResolvedValueOnce({
            id: ANSWER_ID,
            type: answerTypes.TEXTFIELD
          })
        },
        BinaryExpression2: {
          insert: jest.fn().mockResolvedValueOnce({
            id: BINARY_EXPRESSION_ID,
            expressionGroupId: EXPRESSION_GROUP_ID,
            condition: "Equal"
          }),
          getByExpressionGroupId: jest.fn().mockResolvedValueOnce([
            {
              id: BINARY_EXPRESSION_ID,
              expressionGroupId: EXPRESSION_GROUP_ID,
              condition: "Equal"
            }
          ])
        },
        LeftSide2: {
          insert: jest.fn().mockResolvedValueOnce({
            id: LEFT_SIDE_ID,
            expressionId: BINARY_EXPRESSION_ID,
            answerId: ANSWER_ID,
            type: "Answer"
          }),
          getByExpressionId: jest.fn().mockResolvedValueOnce({
            id: LEFT_SIDE_ID,
            expressionId: BINARY_EXPRESSION_ID,
            answerId: ANSWER_ID,
            type: "Answer"
          })
        }
      }
    };
  });

  describe("Routing2", () => {
    describe("create", () => {
      it("should create a Routing2 with a default else destination", async () => {
        const query = `
          mutation createRouting2($input: CreateRouting2Input!) {
            createRouting2(input: $input) {
              id
              else {
                id
                logical
              }
            }
          }`;
        const input = {
          pageId: PAGE_ID
        };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.repositories.Routing2.insert).toHaveBeenCalledWith({
          pageId: PAGE_ID,
          destinationId: FIRST_DESTINATION_ID
        });
        expect(ctx.repositories.Destination.insert).toHaveBeenCalled();
        expect(result.data).toMatchObject({
          createRouting2: {
            id: ROUTING_ID.toString(),
            else: { id: FIRST_DESTINATION_ID.toString(), logical: NEXT_PAGE }
          }
        });
      });

      it("should create a Routing2 with a first rule with a default destination", async () => {
        const query = `
          mutation createRouting2($input: CreateRouting2Input!) {
            createRouting2(input: $input) {
              id
              rules {
                id
                destination {
                  id
                  logical
                }
              }
            }
          }`;
        const input = { pageId: PAGE_ID };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.repositories.RoutingRule2.insert).toHaveBeenCalledWith({
          routingId: ROUTING_ID,
          destinationId: SECOND_DESTINATION_ID
        });
        expect(ctx.repositories.Destination.insert).toHaveBeenCalled();
        expect(result.data).toMatchObject({
          createRouting2: {
            id: ROUTING_ID.toString(),
            rules: [
              {
                id: ROUTING_RULE_ID.toString(),
                destination: {
                  id: SECOND_DESTINATION_ID.toString(),
                  logical: NEXT_PAGE
                }
              }
            ]
          }
        });
      });

      it("should create a Routing2 with a rule with an expression group", async () => {
        const query = `
          mutation createRouting2($input: CreateRouting2Input!) {
            createRouting2(input: $input) {
              id
              rules {
                id
                expressionGroup {
                  id
                  operator
                }
              }
            }
          }`;
        const input = { pageId: PAGE_ID };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.repositories.RoutingRule2.insert).toHaveBeenCalledWith({
          routingId: ROUTING_ID,
          destinationId: SECOND_DESTINATION_ID
        });
        expect(ctx.repositories.ExpressionGroup2.insert).toHaveBeenCalledWith({
          ruleId: ROUTING_RULE_ID
        });
        expect(result.data).toMatchObject({
          createRouting2: {
            id: ROUTING_ID.toString(),
            rules: [
              {
                id: ROUTING_RULE_ID.toString(),
                expressionGroup: {
                  id: EXPRESSION_GROUP_ID.toString(),
                  operator: "And"
                }
              }
            ]
          }
        });
      });

      it("should create a Routing2 with a BinaryExpression with a left side of the first answer of the page", async () => {
        const query = `
          mutation createRouting2($input: CreateRouting2Input!) {
            createRouting2(input: $input) {
              id
              rules {
                id
                expressionGroup {
                  id
                  expressions {
                    ... on BinaryExpression2 {
                      id
                      left {
                        ... on BasicAnswer {
                          id
                          type
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
          }`;
        const input = { pageId: PAGE_ID };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.repositories.BinaryExpression2.insert).toHaveBeenCalledWith({
          groupId: EXPRESSION_GROUP_ID
        });
        expect(ctx.repositories.LeftSide2.insert).toHaveBeenCalledWith({
          expressionId: BINARY_EXPRESSION_ID,
          answerId: ANSWER_ID
        });
        expect(result.data).toMatchObject({
          createRouting2: {
            id: ROUTING_ID.toString(),
            rules: [
              {
                id: ROUTING_RULE_ID.toString(),
                expressionGroup: {
                  id: EXPRESSION_GROUP_ID.toString(),
                  expressions: [
                    {
                      id: BINARY_EXPRESSION_ID.toString(),
                      left: {
                        id: ANSWER_ID.toString(),
                        type: answerTypes.TEXTFIELD
                      },
                      condition: "Equal",
                      right: null
                    }
                  ]
                }
              }
            ]
          }
        });
      });
    });

    describe("update", () => {
      it("should update the destination to a page", async () => {
        ctx.repositories.Destination.getById = jest.fn().mockResolvedValue({
          id: FIRST_DESTINATION_ID,
          pageId: LATER_PAGE_ID
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

        const updateResult = await executeQuery(
          updateRouting2Mutation,
          { input: { id: ROUTING_ID, else: { pageId: LATER_PAGE_ID } } },
          ctx
        );

        expect(updateResult.errors).toBeUndefined();
        expect(ctx.repositories.Destination.update).toHaveBeenCalledWith({
          id: FIRST_DESTINATION_ID,
          pageId: LATER_PAGE_ID
        });

        expect(updateResult.data).toMatchObject({
          updateRouting2: {
            id: ROUTING_ID.toString(),
            else: {
              logical: null,
              page: { id: LATER_PAGE_ID.toString() },
              section: null
            }
          }
        });
      });
      it("should update the destination to a section", async () => {
        ctx.repositories.Destination.getById = jest.fn().mockResolvedValue({
          id: FIRST_DESTINATION_ID,
          sectionId: LATER_SECTION_ID
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

        const updateResult = await executeQuery(
          updateRouting2Mutation,
          { input: { id: ROUTING_ID, else: { sectionId: LATER_SECTION_ID } } },
          ctx
        );

        expect(updateResult.errors).toBeUndefined();
        expect(ctx.repositories.Destination.update).toHaveBeenCalledWith({
          id: FIRST_DESTINATION_ID,
          sectionId: LATER_SECTION_ID
        });

        expect(updateResult.data).toMatchObject({
          updateRouting2: {
            id: ROUTING_ID.toString(),
            else: {
              logical: null,
              page: null,
              section: { id: LATER_SECTION_ID.toString() }
            }
          }
        });
      });
      it("should update the destination to a new logical", async () => {
        ctx.repositories.Destination.getById = jest.fn().mockResolvedValue({
          id: FIRST_DESTINATION_ID,
          logical: END_OF_QUESTIONNAIRE
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

        const updateResult = await executeQuery(
          updateRouting2Mutation,
          {
            input: { id: ROUTING_ID, else: { logical: END_OF_QUESTIONNAIRE } }
          },
          ctx
        );

        expect(updateResult.errors).toBeUndefined();
        expect(ctx.repositories.Destination.update).toHaveBeenCalledWith({
          id: FIRST_DESTINATION_ID,
          logical: END_OF_QUESTIONNAIRE
        });

        expect(updateResult.data).toMatchObject({
          updateRouting2: {
            id: ROUTING_ID.toString(),
            else: {
              logical: END_OF_QUESTIONNAIRE,
              page: null,
              section: null
            }
          }
        });
      });

      it("Should error when providing more than one destination", async () => {
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
        const updateResult = await executeQuery(
          updateRouting2Mutation,
          {
            input: {
              id: ROUTING_RULE_ID,
              else: {
                logical: END_OF_QUESTIONNAIRE,
                sectionId: LATER_SECTION_ID
              }
            }
          },
          ctx
        );

        expect(updateResult.errors[0].message).toMatch(
          "Can only provide one destination."
        );
      });
    });
  });

  describe("RoutingRule2", () => {
    describe("create", () => {
      it("should create a rule with a default destination and expression group", async () => {
        const query = `
        mutation createRoutingRule2($input: CreateRoutingRule2Input!) {
          createRoutingRule2(input: $input) {
            id
            routing {
              id
            }
            destination {
              id
              logical
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
                      type
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
        `;
        const input = { routingId: ROUTING_ID };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.repositories.Destination.insert).toHaveBeenCalled();
        expect(ctx.repositories.RoutingRule2.insert).toHaveBeenCalledWith({
          routingId: ROUTING_ID,
          destinationId: FIRST_DESTINATION_ID
        });
        expect(ctx.repositories.ExpressionGroup2.insert).toHaveBeenCalledWith({
          ruleId: ROUTING_RULE_ID
        });
        expect(result.data).toMatchObject({
          createRoutingRule2: {
            id: ROUTING_RULE_ID.toString(),
            routing: {
              id: ROUTING_ID.toString()
            },
            destination: {
              id: FIRST_DESTINATION_ID.toString(),
              logical: NEXT_PAGE
            },
            expressionGroup: {
              id: EXPRESSION_GROUP_ID.toString(),
              operator: "And"
            }
          }
        });
      });

      it("should create an expression group with a default BinaryExpression with a left side of the first answer of the page", async () => {
        const query = `
        mutation createRoutingRule2($input: CreateRoutingRule2Input!) {
          createRoutingRule2(input: $input) {
            id
            expressionGroup {
              id
              expressions {
                ... on BinaryExpression2 {
                  id
                  left {
                    ... on BasicAnswer {
                      id
                      type
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
        `;
        const input = { routingId: ROUTING_ID };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.repositories.Destination.insert).toHaveBeenCalled();
        expect(ctx.repositories.RoutingRule2.insert).toHaveBeenCalledWith({
          routingId: ROUTING_ID,
          destinationId: FIRST_DESTINATION_ID
        });
        expect(ctx.repositories.ExpressionGroup2.insert).toHaveBeenCalledWith({
          ruleId: ROUTING_RULE_ID
        });
        expect(ctx.repositories.BinaryExpression2.insert).toHaveBeenCalledWith({
          groupId: EXPRESSION_GROUP_ID
        });
        expect(ctx.repositories.LeftSide2.insert).toHaveBeenCalledWith({
          expressionId: BINARY_EXPRESSION_ID,
          answerId: ANSWER_ID
        });
        expect(result.data).toMatchObject({
          createRoutingRule2: {
            id: ROUTING_RULE_ID.toString(),
            expressionGroup: {
              id: EXPRESSION_GROUP_ID.toString(),
              expressions: [
                {
                  id: BINARY_EXPRESSION_ID.toString(),
                  left: {
                    id: ANSWER_ID.toString(),
                    type: answerTypes.TEXTFIELD
                  },
                  condition: "Equal",
                  right: null
                }
              ]
            }
          }
        });
      });
    });

    describe("update", () => {
      it("should update the destination to a page", async () => {
        ctx.repositories.Destination.getById = jest.fn().mockResolvedValue({
          id: SECOND_DESTINATION_ID,
          pageId: LATER_PAGE_ID
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

        const updateResult = await executeQuery(
          updateRoutingRule2Mutation,
          {
            input: {
              id: ROUTING_RULE_ID,
              destination: { pageId: LATER_PAGE_ID }
            }
          },
          ctx
        );

        expect(updateResult.errors).toBeUndefined();
        expect(ctx.repositories.Destination.update).toHaveBeenCalledWith({
          id: SECOND_DESTINATION_ID,
          pageId: LATER_PAGE_ID
        });

        expect(updateResult.data).toMatchObject({
          updateRoutingRule2: {
            id: ROUTING_RULE_ID.toString(),
            destination: {
              logical: null,
              page: { id: LATER_PAGE_ID.toString() },
              section: null
            }
          }
        });
      });

      it("should update the destination to a section", async () => {
        ctx.repositories.Destination.getById = jest.fn().mockResolvedValue({
          id: SECOND_DESTINATION_ID,
          sectionId: LATER_SECTION_ID
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

        const updateResult = await executeQuery(
          updateRoutingRule2Mutation,
          {
            input: {
              id: ROUTING_RULE_ID,
              destination: { sectionId: LATER_SECTION_ID }
            }
          },
          ctx
        );

        expect(updateResult.errors).toBeUndefined();
        expect(ctx.repositories.Destination.update).toHaveBeenCalledWith({
          id: SECOND_DESTINATION_ID,
          sectionId: LATER_SECTION_ID
        });

        expect(updateResult.data).toMatchObject({
          updateRoutingRule2: {
            id: ROUTING_RULE_ID.toString(),
            destination: {
              logical: null,
              page: null,
              section: { id: LATER_SECTION_ID.toString() }
            }
          }
        });
      });

      it("should update the destination to a logical", async () => {
        ctx.repositories.Destination.getById = jest.fn().mockResolvedValue({
          id: SECOND_DESTINATION_ID,
          logical: END_OF_QUESTIONNAIRE
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

        const updateResult = await executeQuery(
          updateRoutingRule2Mutation,
          {
            input: {
              id: ROUTING_RULE_ID,
              destination: { logical: END_OF_QUESTIONNAIRE }
            }
          },
          ctx
        );

        expect(updateResult.errors).toBeUndefined();
        expect(ctx.repositories.Destination.update).toHaveBeenCalledWith({
          id: SECOND_DESTINATION_ID,
          logical: END_OF_QUESTIONNAIRE
        });

        expect(updateResult.data).toMatchObject({
          updateRoutingRule2: {
            id: ROUTING_RULE_ID.toString(),
            destination: {
              logical: END_OF_QUESTIONNAIRE,
              page: null,
              section: null
            }
          }
        });
      });

      it("Should error when providing more than one destination", async () => {
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
        const updateResult = await executeQuery(
          updateRoutingRule2Mutation,
          {
            input: {
              id: ROUTING_RULE_ID,
              destination: {
                logical: END_OF_QUESTIONNAIRE,
                sectionId: LATER_SECTION_ID
              }
            }
          },
          ctx
        );

        expect(updateResult.errors[0].message).toMatch(
          "Can only provide one destination."
        );
      });
    });
  });

  describe("BinaryExpression2", () => {
    describe("create", () => {
      it("should create a BinaryExpression2 defaulted left side to first answer of the page", async () => {
        const BINARY_EXPRESSION_ID_2 = 10;

        ctx.repositories = {
          ...ctx.repositories,
          BinaryExpression2: {
            insert: jest.fn().mockResolvedValueOnce({
              id: BINARY_EXPRESSION_ID_2,
              expressionGroupId: EXPRESSION_GROUP_ID,
              condition: "Equal"
            }),
            getByExpressionGroupId: jest.fn().mockResolvedValueOnce([
              {
                id: BINARY_EXPRESSION_ID,
                expressionGroupId: EXPRESSION_GROUP_ID,
                condition: "Equal"
              },
              {
                id: BINARY_EXPRESSION_ID_2,
                expressionGroupId: EXPRESSION_GROUP_ID,
                condition: "Equal"
              }
            ])
          }
        };

        const query = `
        mutation createBinaryExpression2($input: CreateBinaryExpression2Input!) {
          createBinaryExpression2(input: $input) {
            id
            expressionGroup {
              id
              expressions {
                ...on BinaryExpression2 {
                  id
                }
              }
            }
            left {
              ... on BasicAnswer {
                id
                type
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
        `;
        const input = { expressionGroupId: EXPRESSION_GROUP_ID };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.repositories.BinaryExpression2.insert).toHaveBeenCalledWith({
          groupId: EXPRESSION_GROUP_ID
        });
        expect(ctx.repositories.LeftSide2.insert).toHaveBeenCalledWith({
          expressionId: BINARY_EXPRESSION_ID_2,
          answerId: ANSWER_ID
        });
        expect(result.data).toMatchObject({
          createBinaryExpression2: {
            expressionGroup: {
              id: EXPRESSION_GROUP_ID.toString(),
              expressions: [
                { id: BINARY_EXPRESSION_ID.toString() },
                { id: BINARY_EXPRESSION_ID_2.toString() }
              ]
            },
            id: BINARY_EXPRESSION_ID_2.toString(),
            left: {
              id: ANSWER_ID.toString(),
              type: answerTypes.TEXTFIELD
            },
            condition: "Equal",
            right: null
          }
        });
      });
    });
  });
});
