exports.up = function(knex) {
  return knex.schema.table("Pages", table => {
    table
      .integer("order")
      .defaultsTo(0)
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table("Pages", table => {
    table.dropColumn("order");
  });
};
