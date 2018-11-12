const db = require("./");

function Validation() {
  return db("Validation_AnswerRules");
}

module.exports.findAll = function findAll() {
  return Validation().select();
};

module.exports.find = function find(where) {
  return Validation()
    .where(where)
    .first();
};

module.exports.findField = function findById(where = {}, field) {
  return Validation()
    .select(field)
    .where(where)
    .first();
};

module.exports.update = function update(id, updates) {
  return Validation()
    .where({ id: parseInt(id, 10) })
    .update(updates)
    .returning("*");
};

module.exports.create = function create(obj) {
  return Validation()
    .insert(obj)
    .returning("*");
};

module.exports.destroy = function destroy(id) {
  return Validation()
    .where({ id: parseInt(id, 10) })
    .delete()
    .returning("*");
};
