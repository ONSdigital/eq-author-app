const del = require("./delete");

const ROUTING_RULE_ID = 1;
const ROUTING_ID = 2;
const SECOND_ROUTING_RULE_ID = 3;
const PAGE_ID = 4;

describe("delete", () => {
  it("should delete a routing rule and return the parent routing", async () => {
    const repositories = {
      RoutingRule2: {
        delete: jest.fn().mockResolvedValueOnce({
          id: ROUTING_RULE_ID,
          routingId: ROUTING_ID,
        }),
        getByRoutingId: jest
          .fn()
          .mockResolvedValueOnce([{ id: SECOND_ROUTING_RULE_ID }]),
      },
      Routing2: {
        getById: jest
          .fn()
          .mockResolvedValue({ id: ROUTING_ID, pageId: PAGE_ID }),
      },
    };

    const parentRouting = await del({ repositories })(ROUTING_RULE_ID);

    expect(repositories.RoutingRule2.delete).toHaveBeenCalledWith(
      ROUTING_RULE_ID
    );

    expect(parentRouting).toMatchObject({ id: ROUTING_ID, pageId: PAGE_ID });
  });

  it("should delete the routing if it is the last rule", async () => {
    const repositories = {
      RoutingRule2: {
        delete: jest.fn().mockResolvedValueOnce({
          id: ROUTING_RULE_ID,
          routingId: ROUTING_ID,
        }),
        getByRoutingId: jest.fn().mockResolvedValueOnce([]),
      },
      Routing2: {
        delete: jest
          .fn()
          .mockResolvedValueOnce({ id: ROUTING_ID, pageId: PAGE_ID }),
      },
    };

    const parentRouting = await del({ repositories })(ROUTING_RULE_ID);

    expect(repositories.RoutingRule2.delete).toHaveBeenCalledWith(
      ROUTING_RULE_ID
    );

    expect(repositories.Routing2.delete).toHaveBeenCalledWith(ROUTING_ID);

    expect(parentRouting).toMatchObject({ id: ROUTING_ID, pageId: PAGE_ID });
  });
});
