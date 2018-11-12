const db = require("./");

function Option() {
  return db("Options");
}

module.exports.findAll = function findAll() {
  return Option().select();
};

module.exports.findById = function findById(id) {
  return Option()
    .where("id", parseInt(id, 10))
    .first();
};

module.exports.update = function update(id, updates) {
  return Option()
    .where("id", parseInt(id, 10))
    .update(updates)
    .returning("*");
};

module.exports.create = function create(answer) {
  return Option()
    .insert(answer)
    .returning("*");
};

module.exports.destroy = function destroy(id) {
  return Option()
    .where("id", parseInt(id, 10))
    .delete()
    .returning("*");
};
