const answerTypes = require("../../constants/answerTypes");
const conditions = require("../../constants/routingConditions");

const NUMERIC_COMPARISONS = [
  conditions.SELECT,
  conditions.EQUAL,
  conditions.NOT_EQUAL,
  conditions.GREATER_THAN,
  conditions.LESS_THAN,
  conditions.GREATER_OR_EQUAL,
  conditions.LESS_OR_EQUAL,
  conditions.UNANSWERED,
];

const answerConditions = {
  [answerTypes.NUMBER]: NUMERIC_COMPARISONS,
  [answerTypes.CURRENCY]: NUMERIC_COMPARISONS,
  [answerTypes.PERCENTAGE]: NUMERIC_COMPARISONS,
  [answerTypes.RADIO]: [conditions.ONE_OF, conditions.UNANSWERED],
  [answerTypes.UNIT]: NUMERIC_COMPARISONS,
  [answerTypes.DATE]: [
    conditions.SELECT,
    conditions.LESS_THAN,
    conditions.GREATER_THAN,
  ],
  [answerTypes.CHECKBOX]: [
    conditions.ALL_OF,
    conditions.ANY_OF,
    conditions.NOT_ANY_OF,
    conditions.UNANSWERED,
    conditions.COUNT_OF,
  ],
};

const isAnswerTypeSupported = (answerType) =>
  Boolean(answerConditions[answerType]);

const getDefault = (answerType) => answerConditions[answerType][0];

const isValid = (answerType, condition) =>
  (answerConditions[answerType] || []).includes(condition);

module.exports = {
  getDefault,
  isAnswerTypeSupported,
  isValid,
};
