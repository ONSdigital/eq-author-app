const routingConditionConversions = {
  Equal: "equals",
  NotEqual: "not equals",
  GreaterThan: "greater than",
  LessThan: "less than",
  GreaterOrEqual: "greater than or equal to",
  LessOrEqual: "less than or equal to",
  AllOf: "contains all",
  AnyOf: "contains any",
  Unanswered: "not set",
};

const conditionConversion = authorCondition => {
  const runnerCondition = routingConditionConversions[authorCondition];
  if (!runnerCondition) {
    throw new Error(`Unsupported author condition: ${authorCondition}`);
  }
  return runnerCondition;
};

module.exports = conditionConversion;
