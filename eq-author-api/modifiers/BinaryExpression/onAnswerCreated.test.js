const onAnswerCreated = require("./onAnswerCreated");
const answerTypes = require("../../constants/answerTypes");
const conditions = require("../../constants/routingConditions");
const ANSWER_ID = 1;
const PAGE_ID = 2;
const BINARY_EXPRESSION_ID = 3;

describe("onAnswerCreated", () => {
  it("should update LeftSide when first Answer on Page created", async () => {
    const repositories = {
      Answer: {
        getFirstOnPage: jest
          .fn()
          .mockResolvedValueOnce({ id: ANSWER_ID, type: answerTypes.NUMBER })
      },
      LeftSide2: {
        insertMissingDefaults: jest.fn().mockResolvedValueOnce([])
      }
    };

    await onAnswerCreated({ repositories })({
      questionPageId: PAGE_ID,
      id: ANSWER_ID,
      type: answerTypes.NUMBER
    });

    expect(repositories.Answer.getFirstOnPage).toHaveBeenCalledWith(PAGE_ID);
    expect(repositories.LeftSide2.insertMissingDefaults).toHaveBeenCalledWith({
      id: ANSWER_ID,
      type: answerTypes.NUMBER
    });
  });

  it("should not update LeftSide when the answer isn't the first", async () => {
    const repositories = {
      Answer: {
        getFirstOnPage: jest.fn().mockResolvedValueOnce({ id: ANSWER_ID + 1 })
      },
      LeftSide2: {
        insertMissingDefaults: jest.fn().mockResolvedValueOnce()
      }
    };

    await onAnswerCreated({ repositories })({
      questionPageId: PAGE_ID,
      id: ANSWER_ID,
      type: answerTypes.NUMBER
    });

    expect(repositories.Answer.getFirstOnPage).toHaveBeenCalledWith(PAGE_ID);
    expect(repositories.LeftSide2.insertMissingDefaults).not.toHaveBeenCalled();
  });

  it("should update the condition with the correct default condition for a number answer", async () => {
    const repositories = {
      Answer: {
        getFirstOnPage: jest
          .fn()
          .mockResolvedValueOnce({ id: ANSWER_ID, type: answerTypes.NUMBER })
      },
      LeftSide2: {
        insertMissingDefaults: jest.fn().mockResolvedValueOnce([
          {
            answerId: ANSWER_ID,
            expressionId: BINARY_EXPRESSION_ID
          }
        ])
      },
      BinaryExpression2: {
        update: jest.fn()
      }
    };

    await onAnswerCreated({ repositories })({
      questionPageId: PAGE_ID,
      id: ANSWER_ID,
      type: answerTypes.NUMBER
    });

    expect(repositories.BinaryExpression2.update).toHaveBeenCalledWith({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.EQUAL
    });
  });

  it("should update the condition with the correct default condition for a radio answer", async () => {
    const repositories = {
      Answer: {
        getFirstOnPage: jest
          .fn()
          .mockResolvedValueOnce({ id: ANSWER_ID, type: answerTypes.RADIO })
      },
      LeftSide2: {
        insertMissingDefaults: jest.fn().mockResolvedValueOnce([
          {
            answerId: ANSWER_ID,
            expressionId: BINARY_EXPRESSION_ID
          }
        ])
      },
      BinaryExpression2: {
        update: jest.fn()
      }
    };

    await onAnswerCreated({ repositories })({
      questionPageId: PAGE_ID,
      id: ANSWER_ID,
      type: answerTypes.RADIO
    });

    expect(repositories.BinaryExpression2.update).toHaveBeenCalledWith({
      id: BINARY_EXPRESSION_ID,
      condition: conditions.ONE_OF
    });
  });

  it("should not do anything if answer type is not supported", async () => {
    const repositories = {
      Answer: {
        getFirstOnPage: jest.fn()
      }
    };

    await onAnswerCreated({ repositories })({
      questionPageId: PAGE_ID,
      id: ANSWER_ID,
      type: answerTypes.DATE_RANGE
    });

    expect(repositories.Answer.getFirstOnPage).not.toHaveBeenCalled();
  });
});
