const conditions = require("../../constants/routingConditions");
const answerTypes = require("../../constants/answerTypes");

const update = require("./update");

const LEFT_SIDE_ID = 6;
const BASIC_ANSWER_ID = 7;
const BINARY_EXPRESSION_ID = 8;
const MULTIPLE_CHOICE_ANSWER_ID = 12;

describe("Updating", async () => {
  let sharedStubs;
  beforeEach(() => {
    sharedStubs = {
      Answer: {
        getById: jest.fn(id => {
          let type = answerTypes.RADIO;
          if (id === BASIC_ANSWER_ID) {
            type = answerTypes.NUMBER;
          }
          return Promise.resolve({ id, type });
        })
      },
      RightSide2: {
        deleteByExpressionId: jest.fn().mockResolvedValueOnce()
      }
    };
  });
  it("should be able to update the left side", async () => {
    const repositories = {
      ...sharedStubs,
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL
        }),
        update: jest.fn().mockResolvedValueOnce({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL
        })
      },
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue({
          id: LEFT_SIDE_ID
        }),
        update: jest
          .fn()
          .mockResolvedValue({ expressionId: BINARY_EXPRESSION_ID })
      }
    };

    const binaryExpression = await update({ repositories })({
      expressionId: BINARY_EXPRESSION_ID,
      answerId: BASIC_ANSWER_ID
    });

    expect(repositories.LeftSide2.update).toHaveBeenCalledWith({
      id: LEFT_SIDE_ID,
      answerId: BASIC_ANSWER_ID,
      type: "Answer"
    });

    expect(binaryExpression).toMatchObject({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.EQUAL
    });
  });

  it("should set a new condition for the BinaryExpression on a left side update", async () => {
    const repositories = {
      ...sharedStubs,
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL
        }),
        update: jest.fn().mockResolvedValueOnce({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL
        })
      },
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue({
          id: LEFT_SIDE_ID
        }),
        update: jest
          .fn()
          .mockResolvedValue({ expressionId: BINARY_EXPRESSION_ID })
      }
    };

    const binaryExpression = await update({ repositories })({
      expressionId: BINARY_EXPRESSION_ID,
      answerId: MULTIPLE_CHOICE_ANSWER_ID
    });

    expect(repositories.LeftSide2.update).toHaveBeenCalledWith({
      id: LEFT_SIDE_ID,
      answerId: MULTIPLE_CHOICE_ANSWER_ID,
      type: "Answer"
    });

    expect(repositories.BinaryExpression2.update).toHaveBeenCalledWith({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.ONE_OF
    });

    expect(binaryExpression).toMatchObject({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.EQUAL
    });
  });

  it("should delete the right side on the BinaryExpression on a left side update", async () => {
    const repositories = {
      ...sharedStubs,
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL
        }),
        update: jest.fn().mockResolvedValueOnce({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL
        })
      },
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue({
          id: LEFT_SIDE_ID
        }),
        update: jest
          .fn()
          .mockResolvedValue({ expressionId: BINARY_EXPRESSION_ID })
      }
    };

    const binaryExpression = await update({ repositories })({
      expressionId: BINARY_EXPRESSION_ID,
      answerId: MULTIPLE_CHOICE_ANSWER_ID
    });

    expect(repositories.LeftSide2.update).toHaveBeenCalledWith({
      id: LEFT_SIDE_ID,
      answerId: MULTIPLE_CHOICE_ANSWER_ID,
      type: "Answer"
    });

    expect(repositories.RightSide2.deleteByExpressionId).toHaveBeenCalledWith(
      BINARY_EXPRESSION_ID
    );

    expect(binaryExpression).toMatchObject({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.EQUAL
    });
  });
});
