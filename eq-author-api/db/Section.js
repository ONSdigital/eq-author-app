module.exports = knex => {
  const findAll = function() {
    return knex("Sections").select();
  };

  const update = function(id, updates) {
    return knex("Sections")
      .where({ id: parseInt(id, 10) })
      .update(updates)
      .returning("*");
  };

  const create = function(obj) {
    return knex("Sections")
      .insert(obj)
      .returning("*");
  };

  return {
    findAll,
    update,
    create
  };
};
