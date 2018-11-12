
exports.up = function(knex) {
  return knex.schema.createTable("Groups", function(table) {
    table.increments();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.text("title").notNullable();
    table.text("description");

    table.integer("QuestionnaireId")
      .unsigned()
      .index()
      .references("id")
      .inTable("Questionnaires")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("Groups");
};
