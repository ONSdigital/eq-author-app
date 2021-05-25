const converter = require("./convertRoutingConditions");

describe("Convert routing conditions", () => {
  it("should convert from the author condition to the runner condition", () => {
    const conditionMap = {
      Equal: "equals",
      NotEqual: "not equals",
      GreaterThan: "greater than",
      LessThan: "less than",
      GreaterOrEqual: "greater than or equal to",
      LessOrEqual: "less than or equal to",
      NotAnyOf: "not contains any",
    };
    Object.keys(conditionMap).forEach((authorCondition) =>
      expect(converter(authorCondition)).toEqual(conditionMap[authorCondition])
    );
  });

  it("should throw an error when provided an unexpected condition", () => {
    expect(() => {
      converter("broken");
    }).toThrow("Unsupported author condition: broken");
  });
});
