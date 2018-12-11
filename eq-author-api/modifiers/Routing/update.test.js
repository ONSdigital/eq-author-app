const update = require("./update");

const ROUTING_ID = 1;
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
      Routing2: {
        getById: jest.fn().mockResolvedValue({
          id: ROUTING_ID,
          destinationId: DESTINATION_ID
        })
      }
    };

    const rule = await update({ repositories })({
      id: ROUTING_ID,
      else: { pageId: LATER_PAGE_ID }
    });

    expect(repositories.Destination.update).toHaveBeenCalledWith({
      id: DESTINATION_ID,
      pageId: LATER_PAGE_ID
    });
    expect(rule).toMatchObject({
      id: ROUTING_ID
    });
  });
});
