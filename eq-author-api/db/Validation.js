module.exports = knex => {
  const findAll = function() {
    return knex("Validation_AnswerRules").select();
  };

  const find = function(where) {
    return knex("Validation_AnswerRules")
      .where(where)
      .first();
  };

  const update = function(id, updates) {
    return knex("Validation_AnswerRules")
      .where({ id: parseInt(id, 10) })
      .update(updates)
      .returning("*");
  };

  const create = function(obj) {
    return knex("Validation_AnswerRules")
      .insert(obj)
      .returning("*");
  };

  return {
    findAll,
    find,
    update,
    create,
  };
};
