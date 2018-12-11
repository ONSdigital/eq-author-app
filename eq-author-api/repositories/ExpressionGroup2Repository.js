const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ ruleId, operator = "And" }) =>
    knex("ExpressionGroups2")
      .insert({ ruleId, operator })
      .returning("*")
      .then(head);

  const getByRuleId = ruleId =>
    knex("ExpressionGroups2")
      .select()
      .where({ ruleId })
      .first();

  const getById = id =>
    knex("ExpressionGroups2")
      .select()
      .where({ id })
      .first();

  const update = ({ id, operator }) =>
    knex("ExpressionGroups2")
      .where({ id })
      .update({ operator })
      .returning("*")
      .then(head);

  return {
    insert,
    getByRuleId,
    getById,
    update
  };
};
