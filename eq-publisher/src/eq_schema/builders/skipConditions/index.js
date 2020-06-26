const translateBinaryExpression = require("../translateBinaryEpression/translateBinaryExpression");

module.exports = authorSkipConditions => {
  const skipConditions = authorSkipConditions.map(expressionGroup => {
    let skipCondition;
    const when = expressionGroup.expressions.map(expression =>
      translateBinaryExpression(expression)
    );
    skipCondition = { when };
    return skipCondition;
  });
  return [...skipConditions];
};
