module.exports = ({ repositories }) => async answer => {
  const deletedLeftSides = await repositories.LeftSide2.deleteByAnswerId(
    answer.id
  );

  return Promise.all(
    deletedLeftSides.map(deletedLeftSide =>
      repositories.RightSide2.deleteByExpressionId(deletedLeftSide.expressionId)
    )
  );
};
