const db = require("./");

function Section() {
  return db("Sections");
}

module.exports.findAll = function findAll() {
  return Section().select();
};

module.exports.findById = function findById(id) {
  return Section()
    .where("id", parseInt(id, 10))
    .first();
};

module.exports.update = function update(id, updates) {
  return Section()
    .where({ id: parseInt(id, 10) })
    .update(updates)
    .returning("*");
};

module.exports.create = function create(obj) {
  return Section()
    .insert(obj)
    .returning("*");
};

module.exports.destroy = function destroy(id) {
  return Section()
    .where({ id: parseInt(id, 10) })
    .delete()
    .returning("*");
};
