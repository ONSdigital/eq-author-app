const { convertExpressionGroup } = require("../expressionGroup");

module.exports = (authorSkipConditions, ctx) => {
  const skipConditions = authorSkipConditions.map((expressionGroup) => {
    const when = convertExpressionGroup(expressionGroup, ctx);
    return { when };
  });
  return [...skipConditions];
};
