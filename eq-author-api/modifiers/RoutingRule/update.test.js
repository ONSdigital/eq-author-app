const logicalDestinations = require("../../constants/logicalDestinations");

const update = require("./update");

const ROUTING_RULE_ID = 1;
const DESTINATION_ID = 2;
const LATER_PAGE_ID = 3;
const PAGE_ID = 4;
const ROUTING_ID = 5;
const SECTION_ID = 6;

describe("Update", () => {
  let repositories;
  beforeEach(() => {
    repositories = {
      Destination: {
        update: jest.fn().mockResolvedValue({
          id: DESTINATION_ID,
          pageId: LATER_PAGE_ID
        })
      },
      RoutingRule2: {
        getById: jest.fn().mockResolvedValue({
          id: ROUTING_RULE_ID,
          destinationId: DESTINATION_ID,
          routingId: ROUTING_ID
        })
      },
      Routing2: {
        getById: jest.fn().mockResolvedValue({
          id: ROUTING_ID,
          pageId: PAGE_ID
        })
      },
      Page: {
        getRoutingDestinations: jest.fn().mockResolvedValue({
          questionPages: [{ id: LATER_PAGE_ID }],
          sections: [{ id: SECTION_ID }]
        })
      }
    };
  });

  it("should update the destination page", async () => {
    const rule = await update({ repositories })({
      id: ROUTING_RULE_ID.toString(),
      destination: { pageId: LATER_PAGE_ID.toString() }
    });

    expect(repositories.Destination.update).toHaveBeenCalledWith({
      id: DESTINATION_ID,
      pageId: LATER_PAGE_ID.toString()
    });
    expect(rule).toMatchObject({
      id: ROUTING_RULE_ID
    });
  });

  it("should update the destination section", async () => {
    const rule = await update({ repositories })({
      id: ROUTING_RULE_ID.toString(),
      destination: { sectionId: SECTION_ID.toString() }
    });

    expect(repositories.Destination.update).toHaveBeenCalledWith({
      id: DESTINATION_ID,
      sectionId: SECTION_ID.toString()
    });
    expect(rule).toMatchObject({
      id: ROUTING_RULE_ID
    });
  });

  it("should update the destination logical", async () => {
    const rule = await update({ repositories })({
      id: ROUTING_RULE_ID.toString(),
      destination: { logical: logicalDestinations.NEXT_PAGE }
    });

    expect(repositories.Destination.update).toHaveBeenCalledWith({
      id: DESTINATION_ID,
      logical: logicalDestinations.NEXT_PAGE
    });
    expect(rule).toMatchObject({
      id: ROUTING_RULE_ID
    });
  });

  it("should error when the destination page is not valid for the rule", async () => {
    let error;
    try {
      await update({ repositories })({
        id: ROUTING_RULE_ID.toString(),
        destination: { pageId: PAGE_ID.toString() }
      });
    } catch (e) {
      error = e;
    }

    expect(repositories.Routing2.getById).toHaveBeenCalledWith(ROUTING_ID);
    expect(repositories.Page.getRoutingDestinations).toHaveBeenCalledWith(
      PAGE_ID
    );

    expect(repositories.Destination.update).not.toHaveBeenCalled();
    expect(error).not.toBeUndefined();
    expect(error.message).toMatch("The provided desination is invalid");
  });

  it("should error when the destination section is not valid for the rule", async () => {
    let error;
    try {
      await update({ repositories })({
        id: ROUTING_RULE_ID.toString(),
        destination: { sectionId: (SECTION_ID * 10).toString() }
      });
    } catch (e) {
      error = e;
    }

    expect(repositories.Destination.update).not.toHaveBeenCalled();
    expect(error).not.toBeUndefined();
    expect(error.message).toMatch("The provided desination is invalid");
  });
});
