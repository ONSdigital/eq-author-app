const {
  SELECTED_ANSWER_DELETED,
} = require("../../constants/routingNoLeftSide");

module.exports = ({ repositories }) => async answer => {
  const deletedLeftSides = await repositories.LeftSide2.clearByAnswerId(
    answer.id,
    SELECTED_ANSWER_DELETED
  );

  return Promise.all(
    deletedLeftSides.map(deletedLeftSide =>
      repositories.RightSide2.deleteByExpressionId(deletedLeftSide.expressionId)
    )
  );
};
