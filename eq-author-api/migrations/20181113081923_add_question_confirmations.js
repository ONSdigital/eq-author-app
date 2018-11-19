const { noop } = require("lodash");

exports.up = function(knex) {
  return knex.schema.createTable("QuestionConfirmations", table => {
    table.increments("id");

    table.text("title");

    table
      .integer("pageId")
      .unsigned()
      .index()
      .references("id")
      .inTable("Pages")
      .onDelete("CASCADE");

    table.text("positiveLabel");
    table.text("positiveDescription");

    table.text("negativeLabel");
    table.text("negativeDescription");

    table
      .boolean("isDeleted")
      .notNullable()
      .defaultTo(false);

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = noop;
