const db = require("./");

function Questionnaire() {
  return db("Questionnaires");
}

module.exports.findAll = function findAll() {
  return Questionnaire().select();
};

module.exports.findById = function findById(id) {
  return Questionnaire()
    .where("id", parseInt(id, 10))
    .first();
};

module.exports.update = function update(id, updates) {
  return Questionnaire()
    .where("id", parseInt(id, 10))
    .update(updates)
    .returning("*");
};

module.exports.create = function create(obj) {
  return Questionnaire()
    .insert(obj)
    .returning("*");
};

module.exports.destroy = function destroy(id) {
  return Questionnaire()
    .where("id", parseInt(id, 10))
    .delete()
    .returning("*");
};
