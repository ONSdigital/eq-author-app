const executeQuery = require("../../../tests/utils/executeQuery");
const answerTypes = require("../../../constants/answerTypes");
const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE
} = require("../../../constants/logicalDestinations");
const { AND, OR } = require("../../../constants/routingOperators");
const conditions = require("../../../constants/routingConditions");

const ROUTING_ID = 1;
const ROUTING_RULE_ID = 2;
const FIRST_DESTINATION_ID = 3;
const SECOND_DESTINATION_ID = 4;
const EXPRESSION_GROUP_ID = 5;
const LEFT_SIDE_ID = 6;
const BASIC_ANSWER_ID = 7;
const BINARY_EXPRESSION_ID = 8;
const PAGE_ID = 9;
const LATER_PAGE_ID = 10;
const LATER_SECTION_ID = 11;
const MULTIPLE_CHOICE_ANSWER_ID = 12;
const RIGHT_SIDE_ID = 13;

describe("Routing2 Unit", () => {
  let ctx;
  beforeEach(() => {
    ctx = {
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
        QuestionPage: {
          getById: jest.fn(id =>
            Promise.resolve({ id, pageType: "QuestionPage" })
          )
        },
        RoutingRule2: {
          getById: jest.fn().mockResolvedValueOnce({
            id: ROUTING_RULE_ID,
            routingId: ROUTING_ID,
            destinationId: SECOND_DESTINATION_ID
          })
        },
        ExpressionGroup2: {
          getByRuleId: jest.fn().mockResolvedValueOnce({
            id: EXPRESSION_GROUP_ID,
            operator: AND
          }),
          getById: jest.fn().mockResolvedValue({
            id: EXPRESSION_GROUP_ID,
            operator: AND
          }),
          update: jest.fn(input => Promise.resolve(input))
        },
        Answer: {
          getById: jest.fn(id => {
            if (id === BASIC_ANSWER_ID) {
              return Promise.resolve({ id, type: answerTypes.NUMBER });
            }
            if (id === MULTIPLE_CHOICE_ANSWER_ID) {
              return Promise.resolve({ id, type: answerTypes.RADIO });
            }
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
      }
    };
  });

  describe("Routing2", () => {
    describe("create", () => {
      it("should call the modifier to create the routing", async () => {
        ctx.modifiers = {
          Routing: {
            create: jest.fn().mockResolvedValue({
              id: ROUTING_ID,
              destinationId: FIRST_DESTINATION_ID
            })
          }
        };
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

        expect(ctx.modifiers.Routing.create).toHaveBeenCalledWith(
          PAGE_ID.toString()
        );

        expect(result.data).toMatchObject({
          createRouting2: {
            id: ROUTING_ID.toString(),
            else: { id: FIRST_DESTINATION_ID.toString(), logical: NEXT_PAGE }
          }
        });
      });
    });

    describe("update", () => {
      it("should update the destination to a page", async () => {
        ctx.modifiers = {
          Routing: {
            update: jest.fn().mockResolvedValueOnce({
              id: ROUTING_ID,
              destinationId: FIRST_DESTINATION_ID
            })
          }
        };
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
        expect(ctx.modifiers.Routing.update).toHaveBeenCalledWith({
          id: ROUTING_ID.toString(),
          else: {
            pageId: LATER_PAGE_ID.toString()
          }
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

      it("should error when providing more than one destination", async () => {
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
    it("should call the create modifier", async () => {
      ctx.modifiers = {
        RoutingRule: {
          create: jest.fn().mockResolvedValueOnce({
            id: ROUTING_RULE_ID,
            destinationId: FIRST_DESTINATION_ID
          })
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
            operator: AND
          }
        }
      });
    });

    describe("update", () => {
      it("should update the destination", async () => {
        ctx.repositories.Destination.getById = jest.fn().mockResolvedValue({
          id: SECOND_DESTINATION_ID,
          pageId: LATER_PAGE_ID
        });
        ctx.modifiers = {
          RoutingRule: {
            update: jest.fn().mockResolvedValueOnce({
              id: ROUTING_RULE_ID,
              destinationId: SECOND_DESTINATION_ID
            })
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
          ctx
        );

        expect(updateResult.errors[0].message).toMatch(
          "Can only provide one destination."
        );
      });
    });
  });

  describe("ExpressionGroup2", () => {
    it("should update the operator of an expression group", async () => {
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
        { input: { id: EXPRESSION_GROUP_ID, operator: OR } },
        ctx
      );

      expect(updateResult.errors).toBeUndefined();
      expect(ctx.repositories.ExpressionGroup2.update).toHaveBeenCalledWith({
        id: EXPRESSION_GROUP_ID.toString(),
        operator: OR
      });
      expect(updateResult.data).toMatchObject({
        updateExpressionGroup2: {
          id: EXPRESSION_GROUP_ID.toString(),
          operator: OR
        }
      });
    });
  });

  describe("BinaryExpression2", () => {
    it("should call the modifier with the parsed input on create", async () => {
      const BINARY_EXPRESSION_ID_2 = 20;
      ctx.repositories = {
        ...ctx.repositories,
        BinaryExpression2: {
          getByExpressionGroupId: jest.fn().mockResolvedValueOnce([
            {
              id: BINARY_EXPRESSION_ID,
              expressionGroupId: EXPRESSION_GROUP_ID,
              condition: conditions.EQUAL
            },
            {
              id: BINARY_EXPRESSION_ID_2,
              expressionGroupId: EXPRESSION_GROUP_ID,
              condition: conditions.EQUAL
            }
          ])
        }
      };
      ctx.modifiers = {
        BinaryExpression: {
          create: jest.fn().mockResolvedValueOnce({
            id: BINARY_EXPRESSION_ID_2,
            expressionGroupId: EXPRESSION_GROUP_ID,
            condition: conditions.EQUAL
          })
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
      expect(ctx.modifiers.BinaryExpression.create).toHaveBeenCalledWith(
        EXPRESSION_GROUP_ID
      );
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
            id: BASIC_ANSWER_ID.toString(),
            type: answerTypes.NUMBER
          },
          condition: conditions.EQUAL,
          right: null
        }
      });
    });
    describe("update", () => {
      it("should call the modifier with the parsed input on create", async () => {
        ctx.repositories.RightSide2 = {
          getByExpressionId: jest.fn().mockResolvedValue({
            id: RIGHT_SIDE_ID,
            type: "Custom",
            customValue: { number: 42 }
          })
        };
        ctx.modifiers = {
          BinaryExpression: {
            update: jest.fn().mockResolvedValueOnce({
              id: BINARY_EXPRESSION_ID,
              condition: conditions.NOT_EQUAL
            })
          }
        };

        const query = `
          mutation updateBinaryExpression2($input: UpdateBinaryExpression2Input!) {
            updateBinaryExpression2(input: $input) {
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
              }
            }
          }
          `;
        const input = {
          id: BINARY_EXPRESSION_ID,
          left: {
            answerId: BASIC_ANSWER_ID
          },
          condition: conditions.NOT_EQUAL,
          right: {
            customValue: {
              number: 42
            }
          }
        };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.modifiers.BinaryExpression.update).toHaveBeenCalledWith({
          id: BINARY_EXPRESSION_ID.toString(),
          left: {
            answerId: BASIC_ANSWER_ID.toString()
          },
          condition: conditions.NOT_EQUAL,
          right: {
            customValue: {
              number: 42
            }
          }
        });
        expect(result.data).toMatchObject({
          updateBinaryExpression2: {
            id: BINARY_EXPRESSION_ID.toString(),
            left: {
              id: BASIC_ANSWER_ID.toString()
            },
            condition: conditions.NOT_EQUAL,
            right: {
              number: 42
            }
          }
        });
      });

      it("should error if more than one entity passed to left", async () => {
        const query = `
          mutation updateBinaryExpression2($input: UpdateBinaryExpression2Input!) {
            updateBinaryExpression2(input: $input) {
              id
            }
          }
          `;
        const input = {
          id: BINARY_EXPRESSION_ID,
          left: {
            answerId: BASIC_ANSWER_ID,
            metadataId: 5
          },
          condition: conditions.EQUAL
        };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).not.toBeUndefined();
        expect(result.errors[0].message).toMatch(/Left/);
        expect(result.errors[0].message).toMatch(/one entity/);
      });

      it("should error if more than one entity passed to right", async () => {
        const query = `
          mutation updateBinaryExpression2($input: UpdateBinaryExpression2Input!) {
            updateBinaryExpression2(input: $input) {
              id
            }
          }
          `;
        const input = {
          id: BINARY_EXPRESSION_ID,
          left: {
            answerId: BASIC_ANSWER_ID
          },
          condition: conditions.EQUAL,
          right: {
            answerId: BASIC_ANSWER_ID,
            selectedOptions: [1, 2]
          }
        };
        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).not.toBeUndefined();
        expect(result.errors[0].message).toMatch(/Right/);
        expect(result.errors[0].message).toMatch(/one entity/);
      });
    });
  });
});
