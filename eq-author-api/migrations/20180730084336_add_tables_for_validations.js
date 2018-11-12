const createAnswerValidationRulesTable = async knex => {
  return knex.schema.createTable("Validation_AnswerRules", function(table) {
    table.increments();

    table
      .integer("AnswerId")
      .unsigned()
      .references("id")
      .inTable("Answers")
      .onDelete("CASCADE");

    table.enum("validationType", ["minValue", "maxValue"]).notNullable();

    table
      .bool("enabled")
      .defaultsTo(false)
      .notNull();

    table
      .jsonb("config")
      .defaultsTo("{}")
      .notNull();

    table.jsonb("custom");
  });
};

exports.up = async function(knex) {
  await createAnswerValidationRulesTable(knex);
};

exports.down = async function(knex) {
  await knex.schema.dropTable("Validation_AnswerRules");
};
