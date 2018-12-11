const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ expressionId, customValue, type }) => {
    return knex("RightSides2")
      .insert({ expressionId, customValue, type })
      .returning("*")
      .then(head);
  };

  const getByExpressionId = expressionId =>
    knex("RightSides2")
      .select()
      .where({ expressionId })
      .first();

  const update = ({ id, customValue, type }) => {
    return knex("RightSides2")
      .where({ id })
      .update({ customValue, type })
      .returning("*")
      .then(head);
  };

  return { insert, getByExpressionId, update };
};
