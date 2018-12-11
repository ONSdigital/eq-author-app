const conditions = require("../../constants/routingConditions");

const update = require("./update");

const LEFT_SIDE_ID = 6;
const BASIC_ANSWER_ID = 7;
const BINARY_EXPRESSION_ID = 8;
const MULTIPLE_CHOICE_ANSWER_ID = 12;
const RIGHT_SIDE_ID = 13;
const CUSTOM_RIGHT_SIDE_VALUE = 14;
const OPTION_ONE_ID = 15;
const OPTION_TWO_ID = 16;

describe("Update", () => {
  it("should be able to update the left side", async () => {
    const repositories = {
      BinaryExpression2: {
        getById: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.EQUAL
        })
      },
      LeftSide2: {
        getByExpressionId: jest.fn().mockResolvedValue({
          id: LEFT_SIDE_ID
        }),
        update: jest.fn().mockResolvedValue()
      }
    };

    const binaryExpression = await update({ repositories })({
      id: BINARY_EXPRESSION_ID,
      left: {
        answerId: MULTIPLE_CHOICE_ANSWER_ID
      }
    });

    expect(repositories.LeftSide2.update).toHaveBeenCalledWith({
      id: LEFT_SIDE_ID,
      answerId: MULTIPLE_CHOICE_ANSWER_ID,
      type: "Answer"
    });

    expect(binaryExpression).toMatchObject({
      id: BINARY_EXPRESSION_ID
    });
  });

  it("should be able to update the condition", async () => {
    const repositories = {
      BinaryExpression2: {
        getById: jest
          .fn()
          .mockResolvedValueOnce({
            id: BINARY_EXPRESSION_ID,
            condition: conditions.EQUAL
          })
          .mockResolvedValueOnce({
            id: BINARY_EXPRESSION_ID,
            condition: conditions.ONE_OF
          }),
        update: jest.fn().mockResolvedValue({
          id: BINARY_EXPRESSION_ID,
          condition: conditions.ONE_OF
        })
      }
    };

    const binaryExpression = await update({ repositories })({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.ONE_OF
    });

    expect(repositories.BinaryExpression2.update).toHaveBeenCalledWith({
      condition: conditions.ONE_OF,
      id: BINARY_EXPRESSION_ID
    });

    expect(binaryExpression).toMatchObject({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.ONE_OF
    });
  });

  describe("Right side updates", () => {
    it("should create a right side on update when one doesn't exist", async () => {
      const repositories = {
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
        }
      };

      await update({ repositories })({
        id: BINARY_EXPRESSION_ID,
        right: { customValue: { number: CUSTOM_RIGHT_SIDE_VALUE } }
      });

      expect(repositories.RightSide2.insert).toHaveBeenCalledWith({
        customValue: { number: CUSTOM_RIGHT_SIDE_VALUE },
        expressionId: BINARY_EXPRESSION_ID,
        type: "Custom"
      });
    });

    it("should be able to update the right side to custom value when one already exists", async () => {
      const repositories = {
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
        }
      };

      await update({ repositories })({
        id: BINARY_EXPRESSION_ID,
        right: { customValue: { number: CUSTOM_RIGHT_SIDE_VALUE } }
      });

      expect(repositories.RightSide2.update).toHaveBeenCalledWith({
        customValue: { number: CUSTOM_RIGHT_SIDE_VALUE },
        type: "Custom",
        id: RIGHT_SIDE_ID
      });
    });

    it("should be able to update the right side to selected options", async () => {
      const repositories = {
        BinaryExpression2: {
          getById: jest.fn().mockResolvedValue({
            id: BINARY_EXPRESSION_ID
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
        }
      };

      await update({ repositories })({
        id: BINARY_EXPRESSION_ID,
        right: { selectedOptions: [OPTION_ONE_ID, OPTION_TWO_ID] }
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
  });
});
