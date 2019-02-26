const answerTypeToConditions = require("./answerTypeToConditions");

const { first, flatMap, filter, forEach } = require("lodash/fp");

module.exports = (questionnaire, page, answer) => {
  if (!page.routing) {
    return;
  }

  if (!answerTypeToConditions.isAnswerTypeSupported(answer.type)) {
    return;
  }

  if (answer !== first(page.answers)) {
    return;
  }

  const condition = answerTypeToConditions.getDefault(answer.type);

  const expressions = filter(
    expression => expression.left.type === "Null",
    flatMap(rule => rule.expressionGroup.expressions, page.routing.rules)
  );

  forEach(expression => {
    expression.condition = condition;
    expression.left.answerId = answer.id;
    expression.left.type = "Answer";
    expression.left.nullReason = undefined;
  }, expressions);
};
