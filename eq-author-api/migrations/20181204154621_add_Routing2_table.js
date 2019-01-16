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

  await knex.schema.createTable("Routing2_Routing", table => {
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
      .inTable("Routing2_Routing")
      .onDelete("CASCADE");

    table
      .integer("destinationId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("Routing2_Destinations")
      .onDelete("CASCADE");
  });

  await knex.schema.createTable("Routing2_ExpressionGroups", table => {
    table.increments();

    table
      .integer("ruleId")
      .unsigned()
      .references("id")
      .inTable("Routing2_Rules")
      .onDelete("CASCADE");

    table.enum("operator", ["Or", "And"]).notNullable();
  });

  await knex.schema.createTable("Routing2_BinaryExpressions", table => {
    table.increments();

    table
      .integer("expressionGroupId")
      .unsigned()
      .references("id")
      .inTable("Routing2_ExpressionGroups")
      .onDelete("CASCADE");

    table.enum("condition", [
      "Equal",
      "NotEqual",
      "GreaterThan",
      "LessThan",
      "GreaterOrEqual",
      "LessOrEqual",
      "OneOf",
    ]);
  });

  await knex.schema.createTable("Routing2_LeftSides", table => {
    table.increments();

    table
      .integer("expressionId")
      .unsigned()
      .references("id")
      .inTable("Routing2_BinaryExpressions")
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

  await knex.schema.createTable("Routing2_RightSides", table => {
    table.increments();

    table
      .integer("expressionId")
      .unsigned()
      .references("id")
      .inTable("Routing2_BinaryExpressions")
      .onDelete("CASCADE")
      .unique();

    table.enum("type", ["Custom", "SelectedOptions"]).notNullable();

    table.jsonb("customValue");
  });

  await knex.schema.createTable("Routing2_SelectedOptions", table => {
    table
      .integer("sideId")
      .unsigned()
      .references("id")
      .inTable("Routing2_RightSides")
      .onDelete("CASCADE");

    table
      .integer("optionId")
      .unsigned()
      .references("id")
      .inTable("Options")
      .onDelete("CASCADE");
  });
};

exports.down = noop;
