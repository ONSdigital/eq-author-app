exports.up = function(knex) {
  return knex.schema.createTable("Metadata", function(table) {
    table.increments();
    table.string("key");
    table.string("alias");
    table
      .enum("type", ["Date", "Text", "Region", "Language"])
      .notNullable()
      .defaultTo("Text");
    table.string("value");
    table
      .bool("isDeleted")
      .notNull()
      .defaultTo(false);
    table
      .integer("QuestionnaireId")
      .unsigned()
      .index()
      .references("id")
      .inTable("Questionnaires")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("Metadata");
};
