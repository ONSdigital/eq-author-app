const answerTypeToConditions = require("./answerTypeToConditions");

module.exports = ({ repositories }) => async ({ questionPageId, id, type }) => {
  if (!answerTypeToConditions.isAnswerTypeSupported(type)) {
    return;
  }

  const firstAnswerOnPage = await repositories.Answer.getFirstOnPage(
    questionPageId
  );

  if (id !== firstAnswerOnPage.id) {
    return;
  }

  const condition = answerTypeToConditions.getDefault(firstAnswerOnPage.type);
  const newLeftSides = await repositories.LeftSide2.insertMissingDefaults(
    firstAnswerOnPage
  );

  await Promise.all(
    newLeftSides.map(leftSide =>
      repositories.BinaryExpression2.update({
        id: leftSide.expressionId,
        condition
      })
    )
  );
};
