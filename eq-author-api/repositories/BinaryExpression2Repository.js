const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ groupId: expressionGroupId, condition = "Equal" }) =>
    knex("Routing2_BinaryExpressions")
      .insert({ expressionGroupId, condition })
      .returning("*")
      .then(head);

  const getByExpressionGroupId = expressionGroupId =>
    knex("Routing2_BinaryExpressions")
      .select()
      .where({ expressionGroupId });

  const getById = id =>
    knex("Routing2_BinaryExpressions")
      .select()
      .where({ id })
      .first();

  const update = ({ id, condition }) =>
    knex("Routing2_BinaryExpressions")
      .where({ id })
      .update({ condition })
      .returning("*")
      .then(head);

  const del = id =>
    knex("Routing2_BinaryExpressions")
      .where({ id })
      .delete()
      .returning("*")
      .then(head);

  return {
    insert,
    getById,
    update,
    getByExpressionGroupId,
    delete: del,
  };
};
