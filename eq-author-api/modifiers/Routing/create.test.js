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
          id: DESTINATION_ID,
        }),
      },
      Routing2: {
        insert: jest.fn().mockResolvedValueOnce({
          id: ROUTING_ID,
        }),
        getByPageId: jest.fn().mockResolvedValueOnce(),
      },
    };
    const modifiers = {
      RoutingRule: {
        create: jest.fn().mockResolvedValueOnce({
          id: ROUTING_RULE_ID,
        }),
      },
    };
    const routing = await create({ repositories, modifiers })(PAGE_ID);

    expect(repositories.Destination.insert).toHaveBeenCalledWith();
    expect(repositories.Routing2.insert).toHaveBeenCalledWith({
      pageId: PAGE_ID,
      destinationId: DESTINATION_ID,
    });
    expect(modifiers.RoutingRule.create).toHaveBeenCalledWith(ROUTING_ID);

    expect(routing).toMatchObject({
      id: ROUTING_ID,
    });
  });

  it("should error when creating a second Routing for a Page", async () => {
    const repositories = {
      Routing2: {
        getByPageId: jest.fn().mockResolvedValueOnce({
          id: ROUTING_ID,
        }),
      },
    };

    try {
      await create({ repositories })(PAGE_ID);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toMatch("one Routing per Page");
    }

    expect(repositories.Routing2.getByPageId).toHaveBeenCalledWith(PAGE_ID);
  });
});
