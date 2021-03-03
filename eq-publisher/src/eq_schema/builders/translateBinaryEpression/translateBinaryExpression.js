const {
  RADIO,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
  CHECKBOX,
} = require("../../../constants/answerTypes");
const conditionConverter = require("../../../utils/convertRoutingConditions");

const authorConditions = {
  UNANSWERED: "Unanswered",
};

const buildRadioAnswerBinaryExpression = ({ left, right, condition }) => {
  if (condition === authorConditions.UNANSWERED) {
    return {
      id: `answer${left.id}`,
      condition: "not set",
    };
  }
  return {
    id: `answer${left.id}`,
    condition: "contains any",
    values: right.options.map((op) => op.label),
  };
};

const buildCheckboxAnswerBinaryExpression = ({ left, right, condition }) => {
  const returnVal = {
    id: `answer${left.id}`,
    condition: conditionConverter(condition),
  };

  if (condition !== authorConditions.UNANSWERED) {
    returnVal.values = right.options.map((op) => op.label);
  }

  return returnVal;
};

const buildBasicAnswerBinaryExpression = ({ left, condition, right }) => {
  const returnVal = {
    id: `answer${left.id}`,
    condition: conditionConverter(condition),
  };

  if (condition !== authorConditions.UNANSWERED) {
    returnVal.value = right.number;
  }

  return returnVal;
};

const translateBinaryExpression = (binaryExpression) => {
  if (binaryExpression.left.type === RADIO) {
    return buildRadioAnswerBinaryExpression(binaryExpression);
  } else if (binaryExpression.left.type === CHECKBOX) {
    return buildCheckboxAnswerBinaryExpression(binaryExpression);
  } else if (
    [CURRENCY, NUMBER, PERCENTAGE, UNIT].includes(binaryExpression.left.type)
  ) {
    return buildBasicAnswerBinaryExpression(binaryExpression);
  } else {
    throw new Error(
      `${binaryExpression.left.type} is not a valid routing answer type`
    );
  }
};

module.exports = translateBinaryExpression;
