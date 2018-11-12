const NumberRoutingCondition = require("./NumberRoutingCondition");

describe("NumberRoutingCondtion", () => {
  const condition = {
    answer: {
      id: "1"
    },
    comparator: "LessThan",
    routingValue: {
      numberValue: 10
    }
  };

  it("should create a number condition", () => {
    expect(
      new NumberRoutingCondition(condition).buildRoutingCondition()
    ).toEqual({
      id: "answer1",
      condition: "less than",
      value: 10
    });
  });
});
