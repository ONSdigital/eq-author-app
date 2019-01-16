const routingConditionConversions = {
  Equal: "equals"
};

const conditionConversion = authorCondition =>
  routingConditionConversions[authorCondition];

module.exports = {
  conditionConversion
};
