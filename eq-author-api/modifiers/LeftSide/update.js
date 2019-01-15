const answerTypeToConditions = require("../BinaryExpression/answerTypeToConditions");

module.exports = ({ repositories }) => async ({ expressionId, answerId }) => {
  const answer = await repositories.Answer.getById(answerId);

  const leftSide = await repositories.LeftSide2.getByExpressionId(expressionId);

  await repositories.LeftSide2.update({
    id: leftSide.id,
    answerId,
    type: "Answer",
  });

  await repositories.RightSide2.deleteByExpressionId(expressionId);

  const binaryExpression = repositories.BinaryExpression2.update({
    id: expressionId,
    condition: answerTypeToConditions.getDefault(answer.type),
  });

  return binaryExpression;
};
