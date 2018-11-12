exports.up = function(knex) {
  return knex.schema.table("Answers", table => {
    table
      .jsonb("properties")
      .defaultsTo("{}")
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table("Answers", table => {
    table.dropColumn("properties");
  });
};
