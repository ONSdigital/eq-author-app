const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ groupId: expressionGroupId, condition = "Equal" }) =>
    knex("BinaryExpressions2")
      .insert({ expressionGroupId, condition })
      .returning("*")
      .then(head);

  const getByExpressionGroupId = expressionGroupId =>
    knex("BinaryExpressions2")
      .select()
      .where({ expressionGroupId });

  return {
    insert,
    getByExpressionGroupId
  };
};
