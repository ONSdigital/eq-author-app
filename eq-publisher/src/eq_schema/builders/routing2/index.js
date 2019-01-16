const translateBinaryExpression = require("./translateBinaryExpression");
const translateRoutingDestination = require("./translateRoutingDestination");

const addRuleToContext = (goto, groupId, ctx) => {
  const destinationType = Object.keys(goto);

  if (destinationType.includes("group")) {
    ctx.routingGotos.push({ groupId: `group${groupId}`, ...goto });
  }
};

module.exports = (routing, pageId, groupId, ctx) => {
  const rules = routing.rules.map(rule => {
    const when = rule.expressionGroup.expressions.reduce(
      (arr, expression) => [...arr, ...translateBinaryExpression(expression)],
      []
    );
    const destination = translateRoutingDestination(
      rule.destination,
      pageId,
      ctx
    );
    const goto = { ...destination, when };

    addRuleToContext(goto, groupId, ctx);
    return { goto };
  });
  const destination = translateRoutingDestination(routing.else, pageId, ctx);
  return [...rules, { goto: destination }];
};
