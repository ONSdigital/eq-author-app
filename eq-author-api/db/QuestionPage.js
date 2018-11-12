const knex = require("./index");

function Question(db = knex) {
  return db("Pages");
}

function restrictType(where = {}) {
  return Object.assign({}, where, { pageType: "QuestionPage" });
}

module.exports.findAll = function findAll() {
  return Question()
    .where(restrictType())
    .select();
};

module.exports.findById = function findById(id) {
  return Question()
    .where(restrictType({ id: parseInt(id, 10) }))
    .first();
};

module.exports.update = function update(id, updates) {
  return Question()
    .where(restrictType({ id: parseInt(id, 10) }))
    .update(updates)
    .returning("*");
};

module.exports.create = function create(obj, db) {
  return Question(db)
    .insert(restrictType(obj))
    .returning("*");
};

module.exports.destroy = function destroy(id) {
  return Question()
    .where(restrictType({ id: parseInt(id, 10) }))
    .delete()
    .returning("*");
};
