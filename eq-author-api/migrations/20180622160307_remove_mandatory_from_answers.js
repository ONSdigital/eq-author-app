exports.up = function(knex) {
  return knex.schema.table("Answers", function(table) {
    table.dropColumn("mandatory");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Answers", function(table) {
    table
      .boolean("mandatory")
      .notNullable()
      .defaultsTo(false);
  });
};
