const {
  SELECTED_ANSWER_DELETED,
} = require("../../constants/routingNoLeftSide");

const { flatMap, filter, forEach } = require("lodash/fp");

module.exports = (questionnaire, page, answer) => {
  if (!page.routing) {
    return;
  }

  const expressions = filter(
    expression => expression.left.answerId === answer.id,
    flatMap(rule => rule.expressionGroup.expressions, page.routing.rules)
  );

  forEach(expression => {
    expression.left.answerId = undefined;
    expression.left.type = "Null";
    expression.left.nullReason = SELECTED_ANSWER_DELETED;
  }, expressions);
};
