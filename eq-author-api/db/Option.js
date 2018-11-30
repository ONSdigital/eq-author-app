module.exports = knex => {
  const findAll = function() {
    return knex("Options").select();
  };

  const findById = function(id) {
    return knex("Options")
      .where("id", parseInt(id, 10))
      .first();
  };

  const update = function(id, updates) {
    return knex("Options")
      .where("id", parseInt(id, 10))
      .update(updates)
      .returning("*");
  };

  const create = function(answer) {
    return knex("Options")
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
