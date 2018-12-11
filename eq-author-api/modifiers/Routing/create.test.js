const create = require("./create");

const ROUTING_ID = 1;
const ROUTING_RULE_ID = 2;
const DESTINATION_ID = 3;
const PAGE_ID = 4;

describe("Create", () => {
  it("should create a routing", async () => {
    const repositories = {
      Destination: {
        insert: jest.fn().mockResolvedValueOnce({
          id: DESTINATION_ID
        })
      },
      Routing2: {
        insert: jest.fn().mockResolvedValueOnce({
          id: ROUTING_ID
        })
      }
    };
    const modifiers = {
      RoutingRule: {
        create: jest.fn().mockResolvedValueOnce({
          id: ROUTING_RULE_ID
        })
      }
    };
    const routing = await create({ repositories, modifiers })(PAGE_ID);

    expect(repositories.Destination.insert).toHaveBeenCalledWith();
    expect(repositories.Routing2.insert).toHaveBeenCalledWith({
      pageId: PAGE_ID,
      destinationId: DESTINATION_ID
    });
    expect(modifiers.RoutingRule.create).toHaveBeenCalledWith(ROUTING_ID);

    expect(routing).toMatchObject({
      id: ROUTING_ID
    });
  });
});
