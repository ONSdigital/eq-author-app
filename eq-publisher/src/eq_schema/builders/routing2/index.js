const translateBinaryExpression = require("../translateBinaryEpression/translateBinaryExpression");
const translateRoutingDestination = require("./translateRoutingDestination");
const { flatMap, filter, reject } = require("lodash");
const { CHECKBOX } = require("../../../constants/answerTypes");
const { getAnswerById } = require("../../../utils/finders");

const addRuleToContext = (goto, groupId, ctx) => {
  const destinationType = Object.keys(goto);

  if (destinationType.includes("group")) {
    ctx.routingGotos.push({ groupId: `group${groupId}`, ...goto });
  }
};

module.exports = (routing, pageId, groupId, ctx) => {
  const rules = flatMap(routing.rules, rule => {
    let runnerRules;

    const destination = translateRoutingDestination(
      rule.destination,
      pageId,
      ctx
    );

    runnerRules = rule.expressionGroup.expressions.map(expression => {
      let rules = [];

      const answer = getAnswerById(ctx.questionnaireJson, expression.left.id);

      const mutuallyExclusiveOptionInRule =
        answer && answer.mutuallyExclusiveOption
          ? filter(
              expression.right.options,
              ({ id }) => id === answer.mutuallyExclusiveOption.id
            ).length
          : 0;

      if (expression.left.type === CHECKBOX && mutuallyExclusiveOptionInRule) {
        let mutuallyExclusiveExpression = JSON.parse(
          JSON.stringify(expression)
        );

        const mutuallyExclusiveOptions =
          mutuallyExclusiveExpression.right.options;

        mutuallyExclusiveExpression.right.options = filter(
          mutuallyExclusiveOptions,
          ({ id }) => id === answer.mutuallyExclusiveOption.id
        );

        mutuallyExclusiveExpression.left.id += "-exclusive";

        rules.push({
          goto: {
            ...destination,
            when: [translateBinaryExpression(mutuallyExclusiveExpression)],
          },
        });

        expression.right.options = reject(
          expression.right.options,
          ({ id }) => id === answer.mutuallyExclusiveOption.id
        );
      }

      rules.push({
        goto: {
          ...destination,
          when: [translateBinaryExpression(expression)],
        },
      });

      return rules;
    })[0];

    runnerRules.map(expression => {
      addRuleToContext(expression.goto, groupId, ctx);
    });
    return runnerRules;
  });
  const destination = translateRoutingDestination(routing.else, pageId, ctx);
  return [...rules, { goto: destination }];
};
