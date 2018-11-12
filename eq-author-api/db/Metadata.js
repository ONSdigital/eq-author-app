const db = require("./");

function Metadata() {
  return db("Metadata");
}

module.exports.findAll = function findAll() {
  return Metadata().select();
};

module.exports.findById = function findById(id) {
  return Metadata()
    .where("id", parseInt(id, 10))
    .first();
};

module.exports.update = function update(id, updates) {
  return Metadata()
    .where("id", parseInt(id, 10))
    .update(updates)
    .returning("*");
};

module.exports.create = function create(obj) {
  return Metadata()
    .insert(obj)
    .returning("*");
};

module.exports.destroy = function destroy(id) {
  return Metadata()
    .where("id", parseInt(id, 10))
    .delete()
    .returning("*");
};
