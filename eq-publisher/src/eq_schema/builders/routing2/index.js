const translateBinaryExpression = require("../translateBinaryEpression/translateBinaryExpression");
const translateRoutingDestination = require("./translateRoutingDestination");
const { flatMap, filter, find, some } = require("lodash");
const { AND } = require("../../../constants/routingOperators");

const addRuleToContext = (goto, groupId, ctx) => {
  const destinationType = Object.keys(goto);

  if (destinationType.includes("group")) {
    ctx.routingGotos.push({ groupId: `group${groupId}`, ...goto });
  }
};

const getMutallyExclusiveAnswer = (answerId, ctx) => {
  const pages = flatMap(
    filter(ctx.questionnaireJson.sections, "pages"),
    "pages"
  );
  const answers = flatMap(filter(pages, "answers"), "answers");
  const answer = find(answers, { id: answerId });
  if (!answer) {
    return null;
  }
  return answer.mutuallyExclusiveOption;
};

const convertExclusiveExpression = expression => {
  let convertedExpression = JSON.parse(JSON.stringify(expression));
  convertedExpression.left.id = `${convertedExpression.left.id}-exclusive`;
  convertedExpression.right.options = filter(
    convertedExpression.right.options,
    option => !some(convertedExpression.left.options, { id: option.id })
  );
  return convertedExpression;
};

const convertNonExclusiveExpression = expression => {
  let convertedExpression = JSON.parse(JSON.stringify(expression));
  convertedExpression.right.options = filter(
    convertedExpression.right.options,
    option => some(convertedExpression.left.options, { id: option.id })
  );
  return convertedExpression;
};

module.exports = (routing, pageId, groupId, ctx) => {
  const rules = flatMap(routing.rules, rule => {
    let runnerRules;

    const destination = translateRoutingDestination(
      rule.destination,
      pageId,
      ctx
    );
    if (rule.expressionGroup.operator === AND) {
      const when = rule.expressionGroup.expressions.reduce(
        (accum, expression) => {
          const mutallyExclusiveAnswer = getMutallyExclusiveAnswer(
            expression.left.id,
            ctx
          );
          if (!mutallyExclusiveAnswer) {
            accum = accum.concat(translateBinaryExpression(expression));
          }

          if (
            mutallyExclusiveAnswer &&
            some(expression.left.options, option =>
              some(expression.right.options, { id: option.id })
            )
          ) {
            accum = accum.concat([
              translateBinaryExpression(
                convertNonExclusiveExpression(expression)
              ),
            ]);
          }

          if (
            mutallyExclusiveAnswer &&
            some(expression.right.options, { id: mutallyExclusiveAnswer.id })
          ) {
            accum = accum.concat([
              translateBinaryExpression(convertExclusiveExpression(expression)),
            ]);
          }

          return accum;
        },
        []
      );

      runnerRules = [
        {
          goto: {
            ...destination,
            when,
          },
        },
      ];
    } else {
      runnerRules = rule.expressionGroup.expressions.reduce(
        (accum, expression) => {
          const mutallyExclusiveAnswer = getMutallyExclusiveAnswer(
            expression.left.id,
            ctx
          );
          if (!mutallyExclusiveAnswer) {
            accum = accum.concat({
              goto: {
                ...destination,
                when: [translateBinaryExpression(expression)],
              },
            });
          }
          if (
            mutallyExclusiveAnswer &&
            some(expression.left.options, option =>
              some(expression.right.options, { id: option.id })
            )
          ) {
            accum = accum.concat({
              goto: {
                ...destination,
                when: [
                  translateBinaryExpression(
                    convertNonExclusiveExpression(expression)
                  ),
                ],
              },
            });
          }
          if (
            mutallyExclusiveAnswer &&
            some(expression.right.options, { id: mutallyExclusiveAnswer.id })
          ) {
            accum = accum.concat({
              goto: {
                ...destination,
                when: [
                  translateBinaryExpression(
                    convertExclusiveExpression(expression)
                  ),
                ],
              },
            });
          }
          return accum;
        },
        []
      );
    }
    runnerRules.map(expression => {
      addRuleToContext(expression.goto, groupId, ctx);
    });
    return runnerRules;
  });
  const destination = translateRoutingDestination(routing.else, pageId, ctx);
  return [...rules, { goto: destination }];
};
