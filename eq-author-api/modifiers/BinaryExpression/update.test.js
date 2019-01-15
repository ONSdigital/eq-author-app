const conditions = require("../../constants/routingConditions");
const answerTypes = require("../../constants/answerTypes");
const update = require("./update");

const LEFT_SIDE_ID = 6;
const BASIC_ANSWER_ID = 7;
const BINARY_EXPRESSION_ID = 8;
const MULTIPLE_CHOICE_ANSWER_ID = 12;

describe("Update", () => {
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
        }),
      },
    };
  });
  it("should be able to update the condition", async () => {
    const repositories = {
      ...sharedStubs,
      BinaryExpression2: {
        getById: jest
          .fn()
          .mockResolvedValueOnce({
            id: BINARY_EXPRESSION_ID,
            condition: conditions.EQUAL,
          })
          .mockResolvedValueOnce({
            id: BINARY_EXPRESSION_ID,
            condition: conditions.ONE_OF,
          }),
        update: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.ONE_OF,
        }),
      },
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue({
          id: LEFT_SIDE_ID,
          answerId: MULTIPLE_CHOICE_ANSWER_ID,
        }),
      },
    };

    const binaryExpression = await update({ repositories })({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.ONE_OF,
    });

    expect(repositories.BinaryExpression2.update).toHaveBeenCalledWith({
      condition: conditions.ONE_OF,
      id: BINARY_EXPRESSION_ID,
    });

    expect(binaryExpression).toMatchObject({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.ONE_OF,
    });
  });

  it("should error if the condition is not compatible with the existing LeftSide", async () => {
    const repositories = {
      ...sharedStubs,
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValueOnce({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.ONE_OF,
        }),
      },
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue({
          id: LEFT_SIDE_ID,
          answerId: MULTIPLE_CHOICE_ANSWER_ID,
        }),
      },
    };
    try {
      await update({ repositories })({
        id: BINARY_EXPRESSION_ID,
        condition: conditions.EQUAL,
      });
    } catch (e) {
      expect(e.message).toMatch("not compatible");
    }
  });

  it("should error if you have no leftside for the expression", async () => {
    const repositories = {
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValueOnce({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL,
        }),
      },
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue(null),
      },
    };
    try {
      await update({ repositories })({
        id: BINARY_EXPRESSION_ID,
        condition: conditions.EQUAL,
      });
    } catch (e) {
      expect(e.message).toMatch("Can't have a condition without a left side");
    }
  });
});
