const conditions = require("../../constants/routingConditions");
const answerTypes = require("../../constants/answerTypes");

const update = require("./update");

const LEFT_SIDE_ID = 6;
const BASIC_ANSWER_ID = 7;
const BINARY_EXPRESSION_ID = 8;
const MULTIPLE_CHOICE_ANSWER_ID = 12;
const RIGHT_SIDE_ID = 13;
const CUSTOM_RIGHT_SIDE_VALUE = 14;
const OPTION_ONE_ID = 15;
const OPTION_TWO_ID = 16;

describe("Right side updates", () => {
  let sharedStubs;
  beforeEach(() => {
    sharedStubs = {
      ...sharedStubs,
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue({
          id: LEFT_SIDE_ID,
          answerId: BASIC_ANSWER_ID
        })
      }
    };
  });

  it("should create a right side on update when one doesn't exist", async () => {
    const repositories = {
      ...sharedStubs,
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL
        })
      },
      RightSide2: {
        getByExpressionId: jest.fn().mockResolvedValueOnce(),
        insert: jest.fn().mockResolvedValue({
          id: RIGHT_SIDE_ID,
          type: "Custom",
          customValue: { number: CUSTOM_RIGHT_SIDE_VALUE }
        })
      },
      Answer: {
        getById: jest.fn().mockResolvedValueOnce({ type: answerTypes.NUMBER })
      }
    };

    await update({ repositories })({
      expressionId: BINARY_EXPRESSION_ID,
      customValue: { number: CUSTOM_RIGHT_SIDE_VALUE }
    });

    expect(repositories.RightSide2.insert).toHaveBeenCalledWith({
      customValue: { number: CUSTOM_RIGHT_SIDE_VALUE },
      expressionId: BINARY_EXPRESSION_ID,
      type: "Custom"
    });
  });

  it("should be able to update the right side to custom value when one already exists", async () => {
    const repositories = {
      ...sharedStubs,
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL
        })
      },
      RightSide2: {
        getByExpressionId: jest.fn().mockResolvedValueOnce({
          id: RIGHT_SIDE_ID,
          type: "Answer",
          answerId: BASIC_ANSWER_ID
        }),
        update: jest.fn().mockResolvedValue({
          id: RIGHT_SIDE_ID,
          type: "Custom",
          customValue: { number: CUSTOM_RIGHT_SIDE_VALUE }
        })
      },
      Answer: {
        getById: jest.fn().mockResolvedValueOnce({ type: answerTypes.NUMBER })
      }
    };

    await update({ repositories })({
      expressionId: BINARY_EXPRESSION_ID,
      customValue: { number: CUSTOM_RIGHT_SIDE_VALUE }
    });

    expect(repositories.RightSide2.update).toHaveBeenCalledWith({
      customValue: { number: CUSTOM_RIGHT_SIDE_VALUE },
      type: "Custom",
      id: RIGHT_SIDE_ID
    });
  });

  it("should be able to update the right side to selected options", async () => {
    const repositories = {
      ...sharedStubs,
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.ONE_OF
        })
      },
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue({
          id: LEFT_SIDE_ID,
          answerId: MULTIPLE_CHOICE_ANSWER_ID
        })
      },
      RightSide2: {
        getByExpressionId: jest.fn().mockResolvedValueOnce({
          id: RIGHT_SIDE_ID,
          type: "Answer",
          answerId: BASIC_ANSWER_ID
        }),
        update: jest.fn().mockResolvedValue({
          id: RIGHT_SIDE_ID,
          type: "SelectedOptions"
        })
      },
      SelectedOptions2: {
        deleteBySideId: jest.fn().mockResolvedValueOnce(),
        insert: jest.fn().mockResolvedValueOnce()
      },
      Answer: {
        getById: jest.fn().mockResolvedValueOnce({ type: answerTypes.RADIO })
      }
    };

    await update({ repositories })({
      expressionId: BINARY_EXPRESSION_ID,
      selectedOptions: [OPTION_ONE_ID, OPTION_TWO_ID]
    });

    expect(repositories.RightSide2.update).toHaveBeenCalledWith({
      id: RIGHT_SIDE_ID,
      type: "SelectedOptions"
    });

    expect(repositories.SelectedOptions2.deleteBySideId).toHaveBeenCalledWith(
      RIGHT_SIDE_ID
    );
    expect(repositories.SelectedOptions2.insert).toHaveBeenCalledWith({
      sideId: RIGHT_SIDE_ID,
      optionId: OPTION_ONE_ID
    });
    expect(repositories.SelectedOptions2.insert).toHaveBeenCalledWith({
      sideId: RIGHT_SIDE_ID,
      optionId: OPTION_TWO_ID
    });
  });

  it("should error if you have no leftside for the expression", async () => {
    const repositories = {
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue(null)
      }
    };
    try {
      await update({ repositories })({
        expressionId: BINARY_EXPRESSION_ID,
        customValue: { number: CUSTOM_RIGHT_SIDE_VALUE }
      });
    } catch (e) {
      expect(e.message).toMatch("Cannot have a right side without a left");
    }
  });

  it("should error when attempting to update with a right side thats incompatible with the left side", async () => {
    const repositories = {
      ...sharedStubs,
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.ONE_OF
        })
      },
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue({
          id: LEFT_SIDE_ID,
          answerId: MULTIPLE_CHOICE_ANSWER_ID
        })
      },
      RightSide2: {
        getByExpressionId: jest.fn().mockResolvedValueOnce({
          id: RIGHT_SIDE_ID,
          type: "Answer",
          answerId: BASIC_ANSWER_ID
        }),
        update: jest.fn().mockResolvedValue({
          id: RIGHT_SIDE_ID,
          type: "SelectedOptions"
        })
      },
      SelectedOptions2: {
        deleteBySideId: jest.fn().mockResolvedValueOnce(),
        insert: jest.fn().mockResolvedValueOnce()
      },
      Answer: {
        getById: jest.fn().mockResolvedValueOnce({ type: answerTypes.RADIO })
      }
    };

    try {
      await update({ repositories })({
        expressionId: BINARY_EXPRESSION_ID,
        customValue: { number: CUSTOM_RIGHT_SIDE_VALUE }
      });
    } catch (e) {
      expect(e.message).toMatch("incompatible");
    }
  });
});
