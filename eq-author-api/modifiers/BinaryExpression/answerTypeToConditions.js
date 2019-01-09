const answerTypes = require("../../constants/answerTypes");
const conditions = require("../../constants/routingConditions");

const answerConditions = {
  [answerTypes.NUMBER]: [
    conditions.EQUAL,
    conditions.NOT_EQUAL,
    conditions.GREATER_THAN,
    conditions.LESS_THAN,
    conditions.GREATER_OR_EQUAL,
    conditions.LESS_OR_EQUAL
  ],
  [answerTypes.CURRENCY]: [
    conditions.EQUAL,
    conditions.NOT_EQUAL,
    conditions.GREATER_THAN,
    conditions.LESS_THAN,
    conditions.GREATER_OR_EQUAL,
    conditions.LESS_OR_EQUAL
  ],
  [answerTypes.RADIO]: [conditions.ONE_OF]
};

const isAnswerTypeSupported = answerType =>
  Boolean(answerConditions[answerType]);

const getDefault = answerType => answerConditions[answerType][0];

const isValid = (answerType, condition) =>
  answerConditions[answerType].includes(condition);

module.exports = {
  getDefault,
  isAnswerTypeSupported,
  isValid
};
