const { first } = require("lodash/fp");
const RadioRoutingCondition = require("./RadioRoutingCondition");

const buildOption = (id, label) => ({
  id,
  label
});

describe("RadioRoutingCondition", () => {
  const buildOptions = answerId => [
    buildOption(`${answerId}_1`, "Yes"),
    buildOption(`${answerId}_2`, "No")
  ];

  const buildAnswer = (id, props = {}) => ({
    id,
    type: "Radio",
    options: buildOptions(id),
    ...props
  });

  const conditions = [
    {
      id: "1",
      comparator: "Equal",
      answer: buildAnswer("1")
    },
    {
      id: "2",
      comparator: "Equal",
      answer: buildAnswer("2")
    }
  ];

  const condition = first(conditions);

  it("should build condition with no options selected", () => {
    expect(
      new RadioRoutingCondition(
        {
          ...condition,
          routingValue: {
            value: []
          }
        },
        conditions
      ).buildRoutingCondition()
    ).toEqual([
      {
        condition: "not equals",
        id: "answer1",
        value: "Yes"
      },
      {
        condition: "not equals",
        id: "answer1",
        value: "No"
      },
      {
        condition: "set",
        id: "answer1"
      }
    ]);
  });

  it("should build condition with one option selected", () => {
    expect(
      new RadioRoutingCondition(
        {
          ...condition,
          routingValue: {
            value: ["1_1"]
          }
        },
        conditions
      ).buildRoutingCondition()
    ).toEqual([
      {
        condition: "not equals",
        id: "answer1",
        value: "No"
      },
      {
        condition: "set",
        id: "answer1"
      }
    ]);
  });

  it("should build condition with all options selected", () => {
    expect(
      new RadioRoutingCondition(
        {
          ...condition,
          routingValue: {
            value: ["1_1", "1_2"]
          }
        },
        conditions
      ).buildRoutingCondition()
    ).toEqual([
      {
        condition: "set",
        id: "answer1"
      }
    ]);
  });

  it("should include other options if included", () => {
    const otherCondition = {
      ...condition,
      routingValue: { value: ["1_3"] },
      answer: {
        ...buildAnswer("1", {
          other: {
            option: buildOption("1_3", "Other")
          }
        })
      }
    };

    const result = new RadioRoutingCondition(otherCondition, [
      ...conditions,
      otherCondition
    ]).buildRoutingCondition();

    expect(result).toEqual([
      {
        condition: "not equals",
        id: "answer1",
        value: "Yes"
      },
      {
        condition: "not equals",
        id: "answer1",
        value: "No"
      },
      {
        condition: "set",
        id: "answer1"
      }
    ]);
  });
});
