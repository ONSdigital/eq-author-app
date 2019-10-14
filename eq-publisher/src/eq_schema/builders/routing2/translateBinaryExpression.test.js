const {
  RADIO,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  CHECKBOX,
} = require("../../../constants/answerTypes");

const translateBinaryExpression = require("./translateBinaryExpression");

describe("Should build a runner representation of a binary expression", () => {
  it("should throw on unsupported answer type", () => {
    const expression = {
      left: {
        id: "1",
        type: "Text",
      },
      condition: "Equal",
      right: {
        number: 5,
        __typeName: "CustomValue2",
      },
    };

    expect(() => translateBinaryExpression(expression)).toThrow(
      "not a valid routing answer type"
    );
  });
  describe("With Radio answers", () => {
    const buildBinaryExpression = (optionsArray, condition) => ({
      left: {
        id: "1",
        type: RADIO,
        options: [
          {
            id: "1",
            value: "yes",
          },
          {
            id: "2",
            value: "no",
          },
          {
            id: "3",
            value: "maybe",
          },
        ],
      },
      condition,
      right: {
        options: optionsArray,
        __typeName: "SelectedOptions2",
      },
    });

    it("With a radio answer and single selected option", () => {
      const expression = buildBinaryExpression(
        [{ id: "2", label: "no" }],
        "OneOf"
      );

      const runnerExpression = translateBinaryExpression(expression);

      expect(runnerExpression).toMatchObject({
        id: "answer1",
        condition: "contains any",
        values: ["no"],
      });
    });

    it("With a radio answer and no selected options", () => {
      const expression = buildBinaryExpression([], "OneOf");

      const runnerExpression = translateBinaryExpression(expression);

      expect(runnerExpression).toMatchObject({
        condition: "not set",
        id: "answer1",
      });
    });

    it("With a radio answer and multiple selected options", () => {
      const expression = buildBinaryExpression(
        [{ id: "2", label: "no" }, { id: "3", label: "maybe" }],
        "OneOf"
      );

      const runnerExpression = translateBinaryExpression(expression);
      expect(runnerExpression).toMatchObject({
        id: "answer1",
        condition: "contains any",
        values: ["no", "maybe"],
      });
    });
  });

  describe("With Checkbox answers", () => {
    const buildBinaryExpression = (optionsArray, condition) => ({
      left: {
        id: "1",
        type: CHECKBOX,
        options: [
          {
            id: "1",
            value: "yes",
          },
          {
            id: "2",
            value: "no",
          },
          {
            id: "3",
            value: "maybe",
          },
        ],
      },
      condition,
      right: {
        options: optionsArray,
        __typeName: "SelectedOptions2",
      },
    });

    it("With a checkbox answer and all of", () => {
      const expression = buildBinaryExpression(
        [{ id: "1", label: "yes" }, { id: "2", label: "no" }],
        "AllOf"
      );

      const runnerExpression = translateBinaryExpression(expression);

      expect(runnerExpression).toMatchObject({
        id: "answer1",
        condition: "contains all",
        values: ["yes", "no"],
      });
    });

    it("With a checkbox answer and any of", () => {
      const expression = buildBinaryExpression(
        [{ id: "1", label: "yes" }, { id: "2", label: "no" }],
        "AnyOf"
      );

      const runnerExpression = translateBinaryExpression(expression);

      expect(runnerExpression).toMatchObject({
        id: "answer1",
        condition: "contains any",
        values: ["yes", "no"],
      });
    });

    it("can translate unanswered question routing from Author to Runner", () => {
      const expression = buildBinaryExpression([], "Unanswered");

      const runnerExpression = translateBinaryExpression(expression);

      expect(runnerExpression).toMatchObject({
        id: "answer1",
        condition: "not set",
      });
    });
  });

  describe("With Number based answers", () => {
    it("supports a custom value", () => {
      [NUMBER, CURRENCY, PERCENTAGE].forEach(type => {
        const expression = {
          left: {
            id: "1",
            type,
          },
          condition: "Equal",
          right: {
            number: 5,
            __typeName: "CustomValue2",
          },
        };
        const runnerExpression = translateBinaryExpression(expression);
        expect(runnerExpression).toMatchObject({
          id: "answer1",
          condition: "equals",
          value: 5,
        });
      });
    });
  });
});
