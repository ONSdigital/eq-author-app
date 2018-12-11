const conditions = require("../../constants/routingConditions");

const create = require("./create");

const ROUTING_ID = 1;
const ROUTING_RULE_ID = 2;
const EXPRESSION_GROUP_ID = 3;
const ANSWER_ID = 4;
const NEW_BINARY_EXPRESSION_ID = 5;
const PAGE_ID = 6;

describe("Create", () => {
  const repositories = {
    Answer: {
      getFirstOnPage: jest.fn().mockResolvedValueOnce({
        id: ANSWER_ID
      })
    },
    BinaryExpression2: {
      insert: jest.fn().mockResolvedValueOnce({
        id: NEW_BINARY_EXPRESSION_ID,
        expressionGroupId: EXPRESSION_GROUP_ID,
        condition: conditions.EQUAL
      })
    },
    ExpressionGroup2: {
      getById: jest.fn().mockResolvedValueOnce({
        ruleId: ROUTING_RULE_ID
      })
    },
    LeftSide2: {
      insert: jest.fn(() => Promise.resolve())
    },
    Routing2: {
      getById: jest.fn().mockResolvedValueOnce({
        pageId: PAGE_ID
      })
    },
    RoutingRule2: {
      getById: jest.fn().mockResolvedValueOnce({
        routingId: ROUTING_ID
      })
    }
  };

  it("should create a BinaryExpression2 defaulted left side to first answer of the page", async () => {
    const binaryExpression = await create({ repositories })(
      EXPRESSION_GROUP_ID
    );
    expect(repositories.BinaryExpression2.insert).toHaveBeenCalledWith({
      groupId: EXPRESSION_GROUP_ID
    });
    expect(repositories.LeftSide2.insert).toHaveBeenCalledWith({
      expressionId: NEW_BINARY_EXPRESSION_ID,
      answerId: ANSWER_ID
    });
    expect(binaryExpression).toMatchObject({
      id: NEW_BINARY_EXPRESSION_ID,
      expressionGroupId: EXPRESSION_GROUP_ID,
      condition: conditions.EQUAL
    });
  });
});
