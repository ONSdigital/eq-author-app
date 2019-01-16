module.exports = knex => {
  const findAll = function findAll() {
    return knex("Questionnaires").select();
  };

  const findById = function findById(id) {
    return knex("Questionnaires")
      .where("id", parseInt(id, 10))
      .first();
  };

  const update = function update(id, updates) {
    return knex("Questionnaires")
      .where("id", parseInt(id, 10))
      .update(updates)
      .returning("*");
  };

  const create = function create(obj) {
    return knex("Questionnaires")
      .insert(obj)
      .returning("*");
  };

  return {
    findAll,
    findById,
    update,
    create,
  };
};
