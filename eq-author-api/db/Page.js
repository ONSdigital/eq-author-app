module.exports = knex => {
  const table = knex("Pages");

  const findAll = function() {
    return table.select();
  };

  const update = function(id, updates) {
    return table
      .where({ id: parseInt(id, 10) })
      .update(updates)
      .returning("*");
  };

  const create = function(obj) {
    return table.insert(obj).returning("*");
  };

  return {
    findAll,
    update,
    create,
  };
};
