const { noop } = require("lodash");

exports.up = async function(knex) {
  await knex.schema.createTable("Routing2_Destinations", table => {
    table.increments();

    table.enum("logical", ["NextPage", "EndOfQuestionnaire"]);

    table
      .integer("pageId")
      .unsigned()
      .references("id")
      .inTable("Pages")
      .onDelete("CASCADE");

    table
      .integer("sectionId")
      .unsigned()
      .references("id")
      .inTable("Sections")
      .onDelete("CASCADE");
  });

  await knex.schema.createTable("Routing2", table => {
    table.increments();

    table
      .integer("pageId")
      .unsigned()
      .references("id")
      .inTable("Pages")
      .onDelete("CASCADE");

    table
      .integer("destinationId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("Routing2_Destinations")
      .onDelete("CASCADE");
  });

  await knex.schema.createTable("Routing2_Rules", table => {
    table.increments();

    table
      .integer("routingId")
      .unsigned()
      .references("id")
      .inTable("Routing2")
      .onDelete("CASCADE");

    table
      .integer("destinationId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("Routing2_Destinations")
      .onDelete("CASCADE");
  });

  await knex.schema.createTable("ExpressionGroups2", table => {
    table.increments();

    table
      .integer("ruleId")
      .unsigned()
      .references("id")
      .inTable("Routing2_Rules")
      .onDelete("CASCADE");

    table.enum("operator", ["Or", "And"]).notNullable();
  });

  await knex.schema.createTable("BinaryExpressions2", table => {
    table.increments();

    table
      .integer("expressionGroupId")
      .unsigned()
      .references("id")
      .inTable("ExpressionGroups2")
      .onDelete("CASCADE");

    table
      .enum("condition", [
        "Equal",
        "NotEqual",
        "GreaterThan",
        "LessThan",
        "GreaterOrEqual",
        "LessOrEqual"
      ])
      .notNullable();
  });

  await knex.schema.createTable("LeftSides2", table => {
    table.increments();

    table
      .integer("expressionId")
      .unsigned()
      .references("id")
      .inTable("BinaryExpressions2")
      .onDelete("CASCADE")
      .unique();

    table.enum("type", ["Answer"]).notNullable();

    table
      .integer("answerId")
      .unsigned()
      .references("id")
      .inTable("Answers")
      .onDelete("CASCADE");
  });
};

exports.down = noop;
