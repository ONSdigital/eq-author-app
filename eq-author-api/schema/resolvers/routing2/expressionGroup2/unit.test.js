const executeQuery = require("../../../../tests/utils/executeQuery");
const { OR } = require("../../../../constants/routingOperators");

const EXPRESSION_GROUP_ID = 1;

describe("ExpressionGroup2 Unit", () => {
  it("should update the operator of an expression group", async () => {
    const ctx = {
      repositories: {
        ExpressionGroup2: {
          update: jest.fn(input => Promise.resolve(input))
        }
      }
    };
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
