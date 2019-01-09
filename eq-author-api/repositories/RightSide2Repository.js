const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ expressionId, customValue, type }) => {
    return knex("Routing2_RightSides")
      .insert({ expressionId, customValue, type })
      .returning("*")
      .then(head);
  };

  const getByExpressionId = expressionId =>
    knex("Routing2_RightSides")
      .select()
      .where({ expressionId })
      .first();

  const update = ({ id, customValue, type }) => {
    return knex("Routing2_RightSides")
      .where({ id })
      .update({ customValue, type })
      .returning("*")
      .then(head);
  };

  const deleteByExpressionId = expressionId =>
    knex("Routing2_RightSides")
      .where({ expressionId })
      .delete();

  return { insert, getByExpressionId, update, deleteByExpressionId };
};
