const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ ruleId, operator = "And" }) =>
    knex("Routing2_ExpressionGroups")
      .insert({ ruleId, operator })
      .returning("*")
      .then(head);

  const getByRuleId = ruleId =>
    knex("Routing2_ExpressionGroups")
      .select()
      .where({ ruleId })
      .first();

  const getById = id =>
    knex("Routing2_ExpressionGroups")
      .select()
      .where({ id })
      .first();

  const update = ({ id, operator }) =>
    knex("Routing2_ExpressionGroups")
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
