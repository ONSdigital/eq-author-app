const logicalDestinations = require("../../constants/logicalDestinations");
const update = require("./update");

const ROUTING_ID = 1;
const DESTINATION_ID = 2;
const LATER_PAGE_ID = 3;
const SECTION_ID = 4;
const CURRENT_PAGE_ID = 5;

describe("Update", () => {
  let repositories;
  beforeEach(() => {
    repositories = {
      Destination: {
        update: jest.fn().mockResolvedValue({
          id: DESTINATION_ID,
        }),
      },
      Routing2: {
        getById: jest.fn().mockResolvedValue({
          id: ROUTING_ID,
          destinationId: DESTINATION_ID,
          pageId: CURRENT_PAGE_ID,
        }),
      },
      Page: {
        getRoutingDestinations: jest.fn().mockResolvedValue({
          questionPages: [{ id: LATER_PAGE_ID }],
          sections: [{ id: SECTION_ID }],
        }),
      },
    };
  });

  it("should update the destination page", async () => {
    const rule = await update({ repositories })({
      id: ROUTING_ID,
      else: { pageId: LATER_PAGE_ID.toString() },
    });

    expect(repositories.Page.getRoutingDestinations).toHaveBeenCalledWith(
      CURRENT_PAGE_ID
    );
    expect(repositories.Destination.update).toHaveBeenCalledWith({
      id: DESTINATION_ID,
      pageId: LATER_PAGE_ID.toString(),
    });
    expect(rule).toMatchObject({
      id: ROUTING_ID,
    });
  });

  it("should update the destination section", async () => {
    const rule = await update({ repositories })({
      id: ROUTING_ID,
      else: { sectionId: SECTION_ID.toString() },
    });

    expect(repositories.Page.getRoutingDestinations).toHaveBeenCalledWith(
      CURRENT_PAGE_ID
    );
    expect(repositories.Destination.update).toHaveBeenCalledWith({
      id: DESTINATION_ID,
      sectionId: SECTION_ID.toString(),
    });
    expect(rule).toMatchObject({
      id: ROUTING_ID,
    });
  });

  it("should update the destination logical", async () => {
    const rule = await update({ repositories })({
      id: ROUTING_ID,
      else: { logical: logicalDestinations.NEXT_PAGE },
    });

    expect(repositories.Destination.update).toHaveBeenCalledWith({
      id: DESTINATION_ID,
      logical: logicalDestinations.NEXT_PAGE,
    });
    expect(rule).toMatchObject({
      id: ROUTING_ID,
    });
  });

  it("should error if the destination page is invalid", async () => {
    let error;
    try {
      await update({ repositories })({
        id: ROUTING_ID,
        else: { pageId: CURRENT_PAGE_ID.toString() },
      });
    } catch (e) {
      error = e;
    }

    expect(repositories.Page.getRoutingDestinations).toHaveBeenCalledWith(
      CURRENT_PAGE_ID
    );
    expect(repositories.Destination.update).not.toHaveBeenCalled();
    expect(error.message).toMatch("The provided desination is invalid");
  });

  it("should error if the destination section is invalid", async () => {
    let error;
    try {
      await update({ repositories })({
        id: ROUTING_ID,
        else: { sectionId: (SECTION_ID * 10).toString() },
      });
    } catch (e) {
      error = e;
    }

    expect(repositories.Page.getRoutingDestinations).toHaveBeenCalledWith(
      CURRENT_PAGE_ID
    );
    expect(repositories.Destination.update).not.toHaveBeenCalled();
    expect(error.message).toMatch("The provided desination is invalid");
  });
});
