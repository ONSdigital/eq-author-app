const { noop } = require("lodash");

exports.up = async function(knex) {
  return knex.schema.table("Validation_AnswerRules", table => {
    table
      .integer("metadataId")
      .unsigned()
      .index()
      .references("id")
      .inTable("Metadata")
      .onDelete("SET NULL");
  });
};

exports.down = noop;
