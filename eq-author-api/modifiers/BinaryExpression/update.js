const answerTypesToCondition = require("./answerTypeToConditions");

module.exports = ({ repositories }) => {
  return async ({ id, condition }) => {
    const expression = await repositories.BinaryExpression2.getById(id);

    const leftSide = await repositories.LeftSide2.getByExpressionId(id);

    if (!leftSide) {
      throw new Error("Can't have a condition without a left side");
    }

    const leftSideAnswer = await repositories.Answer.getById(leftSide.answerId);
    if (!answerTypesToCondition.isValid(leftSideAnswer.type, condition)) {
      throw new Error(
        "This condition is not compatible with the existing left side"
      );
    }

    await repositories.BinaryExpression2.update({
      id: expression.id,
      condition
    });

    return repositories.BinaryExpression2.getById(expression.id);
  };
};
