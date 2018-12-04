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

  return {
    insert,
    getByRuleId,
    getById
  };
};
