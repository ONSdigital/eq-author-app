const {
  SELECTED_ANSWER_DELETED,
} = require("../../constants/routingNoLeftSide");
const onAnswerDeleted = require("./onAnswerDeleted");

const EXPRESSION_1_ID = 1;
const EXPRESSION_2_ID = 2;
const ANSWER_ID = 3;

describe("onAnswerDeleted", () => {
  it("should delete all sides whe an referenced answer is deleted", async () => {
    const repositories = {
      LeftSide2: {
        clearByAnswerId: jest
          .fn()
          .mockResolvedValueOnce([
            { expressionId: EXPRESSION_1_ID },
            { expressionId: EXPRESSION_2_ID },
          ]),
      },
      RightSide2: {
        deleteByExpressionId: jest.fn().mockResolvedValueOnce(),
      },
    };

    await onAnswerDeleted({ repositories })({
      id: ANSWER_ID,
    });

    expect(repositories.LeftSide2.clearByAnswerId).toHaveBeenCalledWith(
      ANSWER_ID,
      SELECTED_ANSWER_DELETED
    );

    expect(repositories.RightSide2.deleteByExpressionId).toHaveBeenCalledWith(
      EXPRESSION_1_ID
    );

    expect(repositories.RightSide2.deleteByExpressionId).toHaveBeenCalledWith(
      EXPRESSION_2_ID
    );
  });
});
