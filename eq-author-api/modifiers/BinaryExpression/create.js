const answerTypeToConditions = require("./answerTypeToConditions");
const {
  NO_ROUTABLE_ANSWER_ON_PAGE,
} = require("../../constants/routingNoLeftSide");

module.exports = ({ repositories }) => async expressionGroupId => {
  const expressionGroup = await repositories.ExpressionGroup2.getById(
    expressionGroupId
  );
  const rule = await repositories.RoutingRule2.getById(expressionGroup.ruleId);
  const routing = await repositories.Routing2.getById(rule.routingId);

  const firstAnswer = await repositories.Answer.getFirstOnPage(routing.pageId);

  const hasRoutableFirstAnswer =
    firstAnswer &&
    answerTypeToConditions.isAnswerTypeSupported(firstAnswer.type);
  let condition;
  if (hasRoutableFirstAnswer) {
    condition = answerTypeToConditions.getDefault(firstAnswer.type);
  }

  const expression = await repositories.BinaryExpression2.insert({
    groupId: expressionGroupId,
    condition,
  });

  if (hasRoutableFirstAnswer) {
    await repositories.LeftSide2.insert({
      expressionId: expression.id,
      answerId: firstAnswer.id,
    });
  } else {
    await repositories.LeftSide2.insert({
      expressionId: expression.id,
      nullReason: NO_ROUTABLE_ANSWER_ON_PAGE,
    });
  }
  return expression;
};
