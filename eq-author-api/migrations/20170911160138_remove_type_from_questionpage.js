exports.up = function(knex) {
  return knex.schema.table("Pages", function(table) {
    table.dropColumn("type");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Pages", function(table) {
    table
      .string("type")
      .notNullable()
      .defaultsTo("General");
  });
};
