exports.up = function(knex) {
  return knex.schema.createTable("Options", function(table) {
    table.increments();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.text("label");
    table.text("description");
    table.text("value");
    table.string("qCode");
    table.integer("childAnswerId");

    table
      .integer("AnswerId")
      .unsigned()
      .index()
      .references("id")
      .inTable("Answers")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("Options");
};
