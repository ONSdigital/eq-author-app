const { checkRoutingDestinations } = require("./routingStrategy");

describe("repositories / strategies / routingStrategy", () => {
  it("should error when trying to navigate to a logical destination that doesn't exist", () => {
    const availableRoutingDestinations = {
      logicalDestinations: [
        {
          logicalDestination: "NextPage"
        },
        {
          logicalDestination: "Summary"
        }
      ]
    };

    const destination = {
      logicalDestination: {
        destinationType: "DoesNotExist"
      }
    };

    expect(
      checkRoutingDestinations(availableRoutingDestinations, destination)
    ).rejects.toThrowError();
  });
});
