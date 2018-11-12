exports.up = function(knex) {
  return knex.schema.table("Validation_AnswerRules", table => {
    table
      .integer("previousAnswerId")
      .unsigned()
      .index()
      .references("id")
      .inTable("Answers")
      .onDelete("SET NULL");
  });
};

exports.down = function() {
  return Promise.resolve();
};
