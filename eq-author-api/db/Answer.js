module.exports = knex => {
  const findAll = function() {
    return knex("Answers").select();
  };

  const findById = function(id) {
    return knex("Answers")
      .where("id", parseInt(id, 10))
      .first();
  };

  const update = function(id, updates) {
    return knex("Answers")
      .where("id", parseInt(id, 10))
      .update(updates)
      .returning("*");
  };

  const create = function(answer) {
    return knex("Answers")
      .insert(answer)
      .returning("*");
  };

  return {
    findAll,
    findById,
    update,
    create
  };
};
