const update = require("./update");

const ROUTING_RULE_ID = 1;
const DESTINATION_ID = 2;
const LATER_PAGE_ID = 3;

describe("Update", () => {
  it("should update the destination", async () => {
    const repositories = {
      Destination: {
        update: jest.fn().mockResolvedValue({
          id: DESTINATION_ID,
          pageId: LATER_PAGE_ID
        })
      },
      RoutingRule2: {
        getById: jest.fn().mockResolvedValue({
          id: ROUTING_RULE_ID,
          destinationId: DESTINATION_ID
        })
      }
    };

    const rule = await update({ repositories })({
      id: ROUTING_RULE_ID,
      destination: { pageId: LATER_PAGE_ID }
    });

    expect(repositories.Destination.update).toHaveBeenCalledWith({
      id: DESTINATION_ID,
      pageId: LATER_PAGE_ID
    });
    expect(rule).toMatchObject({
      id: ROUTING_RULE_ID
    });
  });
});
