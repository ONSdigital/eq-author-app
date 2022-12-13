const answerTypes = require("../../constants/answerTypes");
const conditions = require("../../constants/routingConditions");

const {
  getDefault,
  isAnswerTypeSupported,
  isValid,
} = require("./answerTypeToConditions");

const VALID_TYPES = [
  answerTypes.NUMBER,
  answerTypes.PERCENTAGE,
  answerTypes.CURRENCY,
  answerTypes.RADIO,
  answerTypes.UNIT,
  answerTypes.CHECKBOX,
  answerTypes.DATE,
  answerTypes.SELECT,
];

describe("AnswerTypeToCondition", () => {
  describe("isAnswerTypeSupported()", () => {
    it("should return true for valid answer types", () => {
      Object.values(answerTypes).forEach((type) => {
        const expected = VALID_TYPES.includes(type);
        expect(isAnswerTypeSupported(type)).toEqual(expected);
      });
    });
  });

  describe("getDefault()", () => {
    it("should return equal for all apart from radio", () => {
      const expectedDefaults = {
        [answerTypes.NUMBER]: conditions.SELECT,
        [answerTypes.PERCENTAGE]: conditions.SELECT,
        [answerTypes.CURRENCY]: conditions.SELECT,
        [answerTypes.RADIO]: conditions.ONE_OF,
        [answerTypes.UNIT]: conditions.SELECT,
        [answerTypes.CHECKBOX]: conditions.ALL_OF,
        [answerTypes.DATE]: conditions.SELECT,
        [answerTypes.SELECT]: conditions.ONE_OF,
      };
      VALID_TYPES.forEach((type) => {
        expect(getDefault(type)).toEqual(expectedDefaults[type]);
      });
    });
  });

  describe("isValid()", () => {
    it("should return true for valid answer type and condition combinations", () => {
      [
        { answerType: answerTypes.RADIO, condition: conditions.ONE_OF },
        { answerType: answerTypes.CHECKBOX, condition: conditions.ALL_OF },
        {
          answerType: answerTypes.PERCENTAGE,
          condition: conditions.GREATER_THAN,
        },
        { answerType: answerTypes.NUMBER, condition: conditions.LESS_OR_EQUAL },
        { answerType: answerTypes.CURRENCY, condition: conditions.NOT_EQUAL },
        { answerType: answerTypes.DATE, condition: conditions.LESS_THAN },
      ].forEach(({ answerType, condition }) => {
        expect(isValid(answerType, condition)).toBe(true);
      });
    });

    it("should return false for invalid answer type and condition combinations", () => {
      [
        { answerType: answerTypes.RADIO, condition: conditions.EQUAL },
        { answerType: answerTypes.PERCENTAGE, condition: conditions.ONE_OF },
        { answerType: answerTypes.NUMBER, condition: "FOO" },
        { answerType: "BAR", condition: conditions.NOT_EQUAL },
      ].forEach(({ answerType, condition }) => {
        expect(isValid(answerType, condition)).toBe(false);
      });
    });
  });
});
