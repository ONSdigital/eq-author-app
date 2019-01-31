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
];

describe("AnswerTypeToCondition", () => {
  describe("isAnswerTypeSupported()", () => {
    it("should return true for valid answer types", () => {
      Object.values(answerTypes).forEach(type => {
        const expected = VALID_TYPES.includes(type);
        expect(isAnswerTypeSupported(type)).toEqual(expected);
      });
    });
  });

  describe("getDefault()", () => {
    it("should return equal for all apart from radio", () => {
      VALID_TYPES.forEach(type => {
        const expectedDefaultCondition =
          type === answerTypes.RADIO ? conditions.ONE_OF : conditions.EQUAL;
        expect(getDefault(type)).toEqual(expectedDefaultCondition);
      });
    });
  });

  describe("isValid()", () => {
    it("should return true for valid answer type and condition combinations", () => {
      [
        { answerType: answerTypes.RADIO, condition: conditions.ONE_OF },
        {
          answerType: answerTypes.PERCENTAGE,
          condition: conditions.GREATER_THAN,
        },
        { answerType: answerTypes.NUMBER, condition: conditions.LESS_OR_EQUAL },
        { answerType: answerTypes.CURRENCY, condition: conditions.NOT_EQUAL },
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
