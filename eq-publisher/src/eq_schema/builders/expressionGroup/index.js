const translateBinaryExpression = require("../translateBinaryEpression/translateBinaryExpression");
const { flatMap, filter, find, some } = require("lodash");

const getMutallyExclusiveAnswer = (answerId, ctx) => {
  const pages = flatMap(ctx.questionnaireJson.sections, section =>
    flatMap(section.folders, folder => folder.pages)
  );

  const answers = flatMap(filter(pages, "answers"), "answers");
  const answer = find(answers, { id: answerId });
  if (!answer) {
    return null;
  }
  return answer.mutuallyExclusiveOption;
};

const convertCheckboxExclusiveExpression = expression => {
  let convertedExpression = JSON.parse(JSON.stringify(expression));
  convertedExpression.left.id = `${convertedExpression.left.id}-exclusive`;
  convertedExpression.right.options = filter(
    convertedExpression.right.options,
    option => !some(convertedExpression.left.options, { id: option.id })
  );
  return convertedExpression;
};

const convertCheckboxExpression = expression => {
  let convertedExpression = JSON.parse(JSON.stringify(expression));
  convertedExpression.right.options = filter(
    convertedExpression.right.options,
    option => some(convertedExpression.left.options, { id: option.id })
  );
  return convertedExpression;
};

const convertExpressionGroup = (expressionGroup, ctx) => {
  return expressionGroup.expressions.reduce((accum, expression) => {
    const mutuallyExclusiveAnswer = getMutallyExclusiveAnswer(
      expression.left.id,
      ctx
    );

    if (!mutuallyExclusiveAnswer) {
      accum = accum.concat(translateBinaryExpression(expression));
    }

    if (
      mutuallyExclusiveAnswer &&
      expression.left &&
      expression.right &&
      some(expression.left.options, option =>
        some(expression.right.options, { id: option.id })
      )
    ) {
      accum = accum.concat([
        translateBinaryExpression(convertCheckboxExpression(expression)),
      ]);
    }

    if (
      mutuallyExclusiveAnswer &&
      expression.right &&
      some(expression.right.options, { id: mutuallyExclusiveAnswer.id })
    ) {
      accum = accum.concat([
        translateBinaryExpression(
          convertCheckboxExclusiveExpression(expression)
        ),
      ]);
    }

    return accum;
  }, []);
};

module.exports = { convertExpressionGroup };
