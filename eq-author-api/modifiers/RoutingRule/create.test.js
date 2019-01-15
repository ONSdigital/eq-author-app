const create = require("./create");

const ROUTING_ID = 1;
const ROUTING_RULE_ID = 2;
const FIRST_DESTINATION_ID = 3;
const EXPRESSION_GROUP_ID = 5;

describe("Create", () => {
  it("should create a rule with a default destination, expression group and binary expression", async () => {
    const repositories = {
      Destination: {
        insert: jest.fn().mockResolvedValueOnce({
          id: FIRST_DESTINATION_ID,
        }),
      },
      ExpressionGroup2: {
        insert: jest.fn().mockResolvedValueOnce({
          id: EXPRESSION_GROUP_ID,
        }),
      },
      RoutingRule2: {
        insert: jest.fn().mockResolvedValueOnce({
          id: ROUTING_RULE_ID,
        }),
      },
    };
    const modifiers = {
      BinaryExpression: {
        create: jest.fn().mockResolvedValueOnce(),
      },
    };
    const rule = await create({ repositories, modifiers })(ROUTING_ID);
    expect(repositories.Destination.insert).toHaveBeenCalled();
    expect(repositories.RoutingRule2.insert).toHaveBeenCalledWith({
      routingId: ROUTING_ID,
      destinationId: FIRST_DESTINATION_ID,
    });
    expect(repositories.ExpressionGroup2.insert).toHaveBeenCalledWith({
      ruleId: ROUTING_RULE_ID,
    });
    expect(modifiers.BinaryExpression.create).toHaveBeenCalledWith(
      EXPRESSION_GROUP_ID
    );
    expect(rule).toMatchObject({
      id: ROUTING_RULE_ID,
    });
  });
});
