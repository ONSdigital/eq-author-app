const translateRoutingDestination = require("./translateRoutingDestination");
const { convertExpressionGroup } = require("../expressionGroup");
const { flatMap } = require("lodash");
const { AND } = require("../../../constants/routingOperators");

const addRuleToContext = (goto, groupId, ctx) => {
  const destinationType = Object.keys(goto);

  if (destinationType.includes("group")) {
    ctx.routingGotos.push({ groupId: `group${groupId}`, ...goto });
  }
};

module.exports = (routing, pageId, groupId, ctx) => {
  const rules = flatMap(routing.rules, (rule) => {
    let runnerRules;

    const destination = translateRoutingDestination(
      rule.destination,
      pageId,
      ctx
    );

    if (rule.expressionGroup.operator === AND) {
      const when = convertExpressionGroup(rule.expressionGroup, ctx);

      runnerRules = [
        {
          goto: {
            ...destination,
            when,
          },
        },
      ];
    } else {
      const expressions = convertExpressionGroup(rule.expressionGroup, ctx);
      runnerRules = expressions.map((when) => {
        return {
          goto: {
            ...destination,
            when: [when],
          },
        };
      });
    }
    runnerRules.map((expression) => {
      addRuleToContext(expression.goto, groupId, ctx);
    });
    return runnerRules;
  });
  const destination = translateRoutingDestination(routing.else, pageId, ctx);
  return [...rules, { goto: destination }];
};
