/* eslint-disable camelcase */
const { isEmpty } = require("lodash");

const { RADIO, CURRENCY, NUMBER } = require("../../../constants/answerTypes");
const {
  conditionConversion
} = require("../../../utils/convertRoutingConditions");

const buildMuiltpleChoiceAnswerBinaryExpression = binaryExpression => {
  if (isEmpty(binaryExpression.right.options)) {
    return [
      {
        id: `answer${binaryExpression.left.id}`,
        condition: "not set"
      }
    ];
  } else {
    return binaryExpression.right.options.map(option => ({
      id: `answer${binaryExpression.left.id}`,
      condition: "equals",
      value: option.label
    }));
  }
};

const buildBasicAnswerBinaryExpression = ({ left, condition, right }) => {
  return [
    {
      id: `answer${left.id}`,
      condition: conditionConversion(condition),
      value: right.number
    }
  ];
};

const translateBinaryExpression = binaryExpression => {
  if (binaryExpression.left.type === RADIO) {
    return buildMuiltpleChoiceAnswerBinaryExpression(binaryExpression);
  } else if ([CURRENCY, NUMBER].includes(binaryExpression.left.type)) {
    return buildBasicAnswerBinaryExpression(binaryExpression);
  } else {
    throw new Error(`${binaryExpression.left.type} is not a valid answer type`);
  }
};

module.exports = translateBinaryExpression;
