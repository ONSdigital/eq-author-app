const executeQuery = require("../../../../tests/utils/executeQuery");
const answerTypes = require("../../../../constants/answerTypes");
const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE
} = require("../../../../constants/logicalDestinations");
const { AND } = require("../../../../constants/routingOperators");
const conditions = require("../../../../constants/routingConditions");

const ROUTING_ID = 1;
const ROUTING_RULE_ID = 2;
const FIRST_DESTINATION_ID = 3;
const SECOND_DESTINATION_ID = 4;
const EXPRESSION_GROUP_ID = 5;
const LEFT_SIDE_ID = 6;
const BASIC_ANSWER_ID = 7;
const BINARY_EXPRESSION_ID = 8;
const LATER_PAGE_ID = 10;
const LATER_SECTION_ID = 11;

describe("Routing2 Unit", () => {
  it("should call the create modifier", async () => {
    const ctx = {
      repositories: {
        Routing2: {
          getById: jest.fn().mockResolvedValue({
            id: ROUTING_ID,
            destinationId: FIRST_DESTINATION_ID
          })
        },
        Destination: {
          getById: jest.fn(id => {
            return Promise.resolve({ id, logical: NEXT_PAGE });
          })
        },
        ExpressionGroup2: {
          getByRuleId: jest.fn().mockResolvedValueOnce({
            id: EXPRESSION_GROUP_ID,
            operator: AND
          })
        },
        Answer: {
          getById: jest.fn().mockResolvedValueOnce({
            id: BASIC_ANSWER_ID,
            type: answerTypes.NUMBER
          })
        },
        BinaryExpression2: {
          getByExpressionGroupId: jest.fn().mockResolvedValueOnce([
            {
              id: BINARY_EXPRESSION_ID,
              expressionGroupId: EXPRESSION_GROUP_ID,
              condition: conditions.EQUAL
            }
          ])
        },
        LeftSide2: {
          getByExpressionId: jest.fn().mockResolvedValueOnce({
            id: LEFT_SIDE_ID,
            expressionId: BINARY_EXPRESSION_ID,
            answerId: BASIC_ANSWER_ID,
            type: "Answer"
          })
        },
        RightSide2: {
          getByExpressionId: jest.fn().mockResolvedValueOnce()
        }
      },
      modifiers: {
        RoutingRule: {
          create: jest.fn().mockResolvedValueOnce({
            id: ROUTING_RULE_ID,
            destinationId: FIRST_DESTINATION_ID
          })
        }
      }
    };
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

    expect(ctx.modifiers.RoutingRule.create).toHaveBeenCalledWith(
      ROUTING_ID.toString()
    );

    expect(result.errors).toBeUndefined();
    expect(JSON.parse(JSON.stringify(result.data))).toMatchObject({
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
          operator: AND,
          expressions: [
            {
              condition: conditions.EQUAL,
              id: BINARY_EXPRESSION_ID.toString(),
              left: {
                id: BASIC_ANSWER_ID.toString(),
                type: answerTypes.NUMBER
              },
              right: null
            }
          ]
        }
      }
    });
  });

  describe("update", () => {
    it("should update the destination", async () => {
      const ctx = {
        repositories: {
          QuestionPage: {
            getById: jest.fn(id =>
              Promise.resolve({ id, pageType: "QuestionPage" })
            )
          },
          Destination: {
            getById: jest.fn().mockResolvedValue({
              id: SECOND_DESTINATION_ID,
              pageId: LATER_PAGE_ID
            })
          }
        },
        modifiers: {
          RoutingRule: {
            update: jest.fn().mockResolvedValueOnce({
              id: ROUTING_RULE_ID,
              destinationId: SECOND_DESTINATION_ID
            })
          }
        }
      };

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
      expect(ctx.modifiers.RoutingRule.update).toHaveBeenCalledWith({
        id: ROUTING_RULE_ID.toString(),
        destination: {
          pageId: LATER_PAGE_ID.toString()
        }
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

    it("should error when providing more than one destination", async () => {
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
        {}
      );

      expect(updateResult.errors[0].message).toMatch(
        "Can only provide one destination."
      );
    });
  });

  describe("delete", () => {
    it("should delete a rule", async () => {
      const ctx = {
        repositories: {
          RoutingRule2: {
            delete: jest.fn().mockResolvedValueOnce({ id: ROUTING_RULE_ID })
          }
        }
      };

      const deleteRoutingRuleMutation = `
        mutation deleteRoutingRule2($input: DeleteRoutingRule2Input!) {
          deleteRoutingRule2(input: $input) {
            id
          }
        }
        `;

      const deleteResult = await executeQuery(
        deleteRoutingRuleMutation,
        { input: { id: ROUTING_RULE_ID } },
        ctx
      );

      expect(deleteResult.errors).toBeUndefined();
      expect(deleteResult.data).toMatchObject({
        deleteRoutingRule2: { id: ROUTING_RULE_ID.toString() }
      });

      expect(ctx.repositories.RoutingRule2.delete).toHaveBeenLastCalledWith(
        ROUTING_RULE_ID.toString()
      );
    });
  });
});
