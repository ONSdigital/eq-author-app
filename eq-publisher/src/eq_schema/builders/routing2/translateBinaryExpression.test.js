/* eslint-disable camelcase */

const translateBinaryExpression = require("./translateBinaryExpression");

describe("Should build a runner representation of a binary expression", () => {
  it("should throw on unsupported answer type", () => {
    const expression = {
      left: {
        id: "1",
        type: "Text"
      },
      condition: "Equal",
      right: {
        number: 5,
        __typeName: "CustomValue2"
      }
    };

    expect(() => translateBinaryExpression(expression)).toThrow(
      "not a valid answer type"
    );
  });
  describe("With Radio answers", () => {
    const buildBinaryExpression = (optionsArray, condition) => ({
      left: {
        id: "1",
        type: "Radio",
        options: [
          {
            id: "1",
            value: "yes"
          },
          {
            id: "2",
            value: "no"
          },
          {
            id: "3",
            value: "maybe"
          }
        ]
      },
      condition,
      right: {
        options: optionsArray,
        __typeName: "SelectedOptions2"
      }
    });

    it("With a radio answer and single selected option", () => {
      const expression = buildBinaryExpression(
        [{ id: "2", label: "no" }],
        "Equal"
      );

      const runnerExpression = translateBinaryExpression(expression);

      expect(runnerExpression).toMatchObject([
        {
          id: "answer1",
          condition: "equals",
          value: "no"
        }
      ]);
    });

    it("With a radio answer and no selected options", () => {
      const expression = buildBinaryExpression([], "Equal");

      const runnerExpression = translateBinaryExpression(expression);

      expect(runnerExpression).toMatchObject([
        { condition: "not set", id: "answer1" }
      ]);
    });

    it("With a radio answer and multiple selected options", () => {
      const expression = buildBinaryExpression(
        [{ id: "2", label: "no" }, { id: "3", label: "maybe" }],
        "Equal"
      );

      const runnerExpression = translateBinaryExpression(expression);

      expect(runnerExpression).toMatchObject([
        {
          id: "answer1",
          condition: "equals",
          value: "no"
        },
        {
          id: "answer1",
          condition: "equals",
          value: "maybe"
        }
      ]);
    });
  });

  describe("With Number based answers", () => {
    it("supports a custom value", () => {
      const expression = {
        left: {
          id: "1",
          type: "Number"
        },
        condition: "Equal",
        right: {
          number: 5,
          __typeName: "CustomValue2"
        }
      };
      const runnerExpression = translateBinaryExpression(expression);
      expect(runnerExpression).toMatchObject([
        {
          id: "answer1",
          condition: "equals",
          value: 5
        }
      ]);
    });
  });
});
