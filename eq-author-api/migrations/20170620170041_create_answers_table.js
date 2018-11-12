
exports.up = function(knex) {
  return knex.schema.createTable("Answers", function(table) {
    table.increments();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.text("description");
    table.text("guidance");
    table.string("qCode");
    table.text("label");
    table.enum("type", [
      "Checkbox",
      "Currency",
      "Date",
      "MonthYearDate",
      "Integer",
      "Percentage",
      "PositiveInteger",
      "Radio",
      "TextArea",
      "TextField",
      "Relationship"
    ]).notNullable();
    table.boolean("mandatory").notNullable().defaultsTo(false);

    table.integer("QuestionPageId")
      .unsigned()
      .index()
      .references("id")
      .inTable("Pages")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("Answers");
};
