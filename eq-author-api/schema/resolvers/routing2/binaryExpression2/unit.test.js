const executeQuery = require("../../../../tests/utils/executeQuery");
const answerTypes = require("../../../../constants/answerTypes");
const { AND } = require("../../../../constants/routingOperators");
const conditions = require("../../../../constants/routingConditions");

const EXPRESSION_GROUP_ID = 1;
const LEFT_SIDE_ID = 2;
const BASIC_ANSWER_ID = 3;
const BINARY_EXPRESSION_ID = 4;
const RIGHT_SIDE_ID = 5;

describe("Routing2 Unit", () => {
  describe("BinaryExpression2", () => {
    it("should call the modifier with the parsed input on create", async () => {
      const BINARY_EXPRESSION_ID_2 = 20;
      const ctx = {
        modifiers: {
          BinaryExpression: {
            create: jest.fn().mockResolvedValueOnce({
              id: BINARY_EXPRESSION_ID_2,
              expressionGroupId: EXPRESSION_GROUP_ID,
              condition: conditions.EQUAL
            })
          }
        }
      };

      const query = `
        mutation createBinaryExpression2($input: CreateBinaryExpression2Input!) {
          createBinaryExpression2(input: $input) {
            id
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
          id: BINARY_EXPRESSION_ID_2.toString()
        }
      });
    });

    describe("read", () => {
      it("should be able to retrieve the binary expression data", async () => {
        const BINARY_EXPRESSION_ID_2 = 20;
        const ctx = {
          repositories: {
            Answer: {
              getById: jest.fn().mockResolvedValueOnce({
                id: BASIC_ANSWER_ID,
                type: answerTypes.NUMBER
              })
            },
            ExpressionGroup2: {
              getById: jest.fn().mockResolvedValue({
                id: EXPRESSION_GROUP_ID,
                operator: AND
              })
            },
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
              getByExpressionId: jest.fn().mockResolvedValueOnce({
                id: RIGHT_SIDE_ID,
                type: "Custom",
                customValue: { number: 42 }
              })
            }
          },
          modifiers: {
            BinaryExpression: {
              create: jest.fn().mockResolvedValueOnce({
                id: BINARY_EXPRESSION_ID_2,
                expressionGroupId: EXPRESSION_GROUP_ID,
                condition: conditions.EQUAL
              })
            }
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
               ...on CustomValue2{
                 number
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
            right: { number: 42 }
          }
        });
      });
    });

    describe("Binary expression, LeftSide, RightSide updates", () => {
      it("should call the correct modifier with the parsed input on Binary expression update", async () => {
        const ctx = {
          modifiers: {
            BinaryExpression: {
              update: jest.fn().mockResolvedValueOnce({
                id: BINARY_EXPRESSION_ID,
                condition: conditions.NOT_EQUAL
              })
            }
          }
        };

        const query = `
          mutation updateBinaryExpression2($input: UpdateBinaryExpression2Input!) {
            updateBinaryExpression2(input: $input) {
              id
            }
          }
          `;

        const input = {
          id: BINARY_EXPRESSION_ID,
          condition: conditions.NOT_EQUAL
        };

        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.modifiers.BinaryExpression.update).toHaveBeenCalledWith({
          id: BINARY_EXPRESSION_ID.toString(),
          condition: conditions.NOT_EQUAL
        });
        expect(result.data).toMatchObject({
          updateBinaryExpression2: {
            id: BINARY_EXPRESSION_ID.toString()
          }
        });
      });

      it("should call the correct modifier with the parsed input on Left Side update", async () => {
        const ctx = {
          modifiers: {
            LeftSide: {
              update: jest.fn().mockResolvedValueOnce({
                id: BINARY_EXPRESSION_ID,
                condition: conditions.NOT_EQUAL
              })
            }
          }
        };

        const query = `
          mutation updateLeftSide2($input: UpdateLeftSide2Input!) {
            updateLeftSide2(input: $input) {
              id
            }
          }
          `;

        const input = {
          expressionId: BINARY_EXPRESSION_ID,
          answerId: BASIC_ANSWER_ID
        };

        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.modifiers.LeftSide.update).toHaveBeenCalledWith({
          expressionId: BINARY_EXPRESSION_ID.toString(),
          answerId: BASIC_ANSWER_ID.toString()
        });

        expect(result.data).toMatchObject({
          updateLeftSide2: {
            id: BINARY_EXPRESSION_ID.toString()
          }
        });
      });

      it("should call the correct modifier with the parsed input on Right Side update", async () => {
        const ctx = {
          modifiers: {
            RightSide: {
              update: jest.fn().mockResolvedValueOnce({
                id: BINARY_EXPRESSION_ID,
                condition: conditions.NOT_EQUAL
              })
            }
          }
        };

        const query = `
          mutation updateRightSide2($input: UpdateRightSide2Input!) {
            updateRightSide2(input: $input) {
              id
            }
          }
          `;

        const input = {
          expressionId: BINARY_EXPRESSION_ID,
          customValue: { number: 42 }
        };

        const result = await executeQuery(query, { input }, ctx);
        expect(result.errors).toBeUndefined();
        expect(ctx.modifiers.RightSide.update).toHaveBeenCalledWith({
          expressionId: BINARY_EXPRESSION_ID.toString(),
          customValue: { number: 42 }
        });
        expect(result.data).toMatchObject({
          updateRightSide2: {
            id: BINARY_EXPRESSION_ID.toString()
          }
        });
      });

      it("should error if more than one entity passed to right", async () => {
        const query = `
          mutation updateRightSide2($input: UpdateRightSide2Input!) {
            updateRightSide2(input: $input) {
              id
            }
          }
          `;

        const input = {
          expressionId: BINARY_EXPRESSION_ID,
          customValue: { number: 42 },
          selectedOptions: ["option1"]
        };

        const result = await executeQuery(query, { input }, {});
        expect(result.errors[0].message).toMatch("Too many right side inputs");
      });
    });
    describe("delete", () => {
      it("should call delete", async () => {
        const ctx = {
          repositories: {
            BinaryExpression2: {
              delete: jest
                .fn()
                .mockResolvedValueOnce({ id: BINARY_EXPRESSION_ID })
            }
          }
        };

        const deleteBinaryExpression2Mutation = `
          mutation deleteBinaryExpression2($input: DeleteBinaryExpression2Input!) {
            deleteBinaryExpression2(input: $input) {
              id
            }
          }
        `;

        const deleteResult = await executeQuery(
          deleteBinaryExpression2Mutation,
          { input: { id: BINARY_EXPRESSION_ID } },
          ctx
        );

        expect(deleteResult.errors).toBeUndefined();
        expect(deleteResult.data).toMatchObject({
          deleteBinaryExpression2: { id: BINARY_EXPRESSION_ID.toString() }
        });

        expect(
          ctx.repositories.BinaryExpression2.delete
        ).toHaveBeenLastCalledWith(BINARY_EXPRESSION_ID.toString());
      });
    });
  });
});
