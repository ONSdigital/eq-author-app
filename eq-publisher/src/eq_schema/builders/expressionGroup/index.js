const translateBinaryExpression = require("../translateBinaryEpression/translateBinaryExpression");
const { flatMap, filter, find, some } = require("lodash");

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

const convertExpressionGroup = (expressionGroup, ctx) => {
  return expressionGroup.expressions.reduce((accum, expression) => {
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
        translateBinaryExpression(convertNonExclusiveExpression(expression)),
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
  }, []);
};

module.exports = { convertExpressionGroup };
