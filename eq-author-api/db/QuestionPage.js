function restrictType(where = {}) {
  return Object.assign({}, where, { pageType: "QuestionPage" });
}

module.exports = knex => {
  const findById = function(id) {
    return knex("Pages")
      .where(restrictType({ id: parseInt(id, 10) }))
      .first();
  };

  const update = function(id, updates) {
    return knex("Pages")
      .where(restrictType({ id: parseInt(id, 10) }))
      .update(updates)
      .returning("*");
  };

  const create = function(obj) {
    return knex("Pages")
      .insert(restrictType(obj))
      .returning("*");
  };

  return {
    findById,
    update,
    create
  };
};
