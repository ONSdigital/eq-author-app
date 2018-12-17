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

  const getById = id =>
    knex("BinaryExpressions2")
      .select()
      .where({ id })
      .first();

  const update = ({ id, condition }) =>
    knex("BinaryExpressions2")
      .where({ id })
      .update({ condition })
      .returning("*")
      .then(head);

  const del = id =>
    knex("BinaryExpressions2")
      .where({ id })
      .delete()
      .returning("*")
      .then(head);

  return {
    insert,
    getById,
    update,
    getByExpressionGroupId,
    delete: del
  };
};
