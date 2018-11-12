const knex = require("./");

function Page(db = knex) {
  return db("Pages");
}

module.exports.findAll = function findAll() {
  return Page().select();
};

module.exports.findById = function findById(id) {
  return Page()
    .where("id", parseInt(id, 10))
    .first();
};

module.exports.update = function update(id, updates, db) {
  return Page(db)
    .where({ id: parseInt(id, 10) })
    .update(updates)
    .returning("*");
};

module.exports.create = function create(obj) {
  return Page()
    .insert(obj)
    .returning("*");
};

module.exports.destroy = function destroy(id) {
  return Page()
    .where({ id: parseInt(id, 10) })
    .delete()
    .returning("*");
};
