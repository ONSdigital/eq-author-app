module.exports = knex => {
  const findAll = function() {
    return knex("Metadata").select();
  };

  const findById = function(id) {
    return knex("Metadata")
      .where("id", parseInt(id, 10))
      .first();
  };

  const update = function(id, updates) {
    return knex("Metadata")
      .where("id", parseInt(id, 10))
      .update(updates)
      .returning("*");
  };

  const create = function(obj) {
    return knex("Metadata")
      .insert(obj)
      .returning("*");
  };

  const destroy = function(id) {
    return knex("Metadata")
      .where("id", parseInt(id, 10))
      .delete()
      .returning("*");
  };

  return {
    findAll,
    findById,
    update,
    create,
    destroy
  };
};
