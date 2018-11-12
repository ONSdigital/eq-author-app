const createRoutingRuleSetTable = async knex => {
  return knex.schema.createTable("Routing_RuleSets", function(table) {
    table.increments();

    table
      .integer("QuestionPageId")
      .unsigned()
      .references("id")
      .inTable("Pages")
      .onDelete("CASCADE");

    table
      .integer("RoutingDestinationId")
      .unsigned()
      .references("id")
      .inTable("Routing_Destinations")
      .onDelete("CASCADE");

    table
      .boolean("isDeleted")
      .notNull()
      .defaultTo(false);
  });
};

const createRoutingRuleTable = async knex => {
  return knex.schema.createTable("Routing_Rules", function(table) {
    table.increments();

    table.enum("operation", ["And", "Or"]).notNullable();

    table
      .integer("RoutingRuleSetId")
      .unsigned()
      .references("id")
      .inTable("Routing_RuleSets")
      .onDelete("CASCADE");

    table
      .integer("RoutingDestinationId")
      .unsigned()
      .references("id")
      .inTable("Routing_Destinations")
      .onDelete("CASCADE");

    table
      .boolean("isDeleted")
      .notNull()
      .defaultTo(false);
  });
};

const createRoutingConditionTable = async knex => {
  return knex.schema.createTable("Routing_Conditions", function(table) {
    table.increments();

    table.enum("comparator", ["Equal", "NotEqual"]).notNullable();

    table
      .integer("RoutingRuleId")
      .unsigned()
      .references("id")
      .inTable("Routing_Rules")
      .onDelete("CASCADE");

    table
      .integer("QuestionPageId")
      .unsigned()
      .references("id")
      .inTable("Pages")
      .onDelete("CASCADE");

    table
      .integer("AnswerId")
      .unsigned()
      .references("id")
      .inTable("Answers")
      .onDelete("CASCADE");
  });
};

const createRoutingConditionValuesTable = async knex => {
  return knex.schema.createTable("Routing_ConditionValues", function(table) {
    table.increments();

    table
      .integer("OptionId")
      .unsigned()
      .references("id")
      .inTable("Options")
      .onDelete("CASCADE");

    table
      .integer("ConditionId")
      .unsigned()
      .references("id")
      .inTable("Routing_Conditions")
      .onDelete("CASCADE");
  });
};

const createRoutingDestinationsTable = async knex => {
  return knex.schema.createTable("Routing_Destinations", table => {
    table.increments();

    table
      .enum("logicalDestination", ["NextPage", "EndOfQuestionnaire"])
      .defaultTo("NextPage");

    table
      .integer("PageId")
      .unsigned()
      .references("id")
      .inTable("Pages")
      .onDelete("CASCADE");

    table
      .integer("SectionId")
      .unsigned()
      .references("id")
      .inTable("Sections")
      .onDelete("CASCADE");
  });
};

exports.up = async function(knex) {
  await createRoutingDestinationsTable(knex);
  await createRoutingRuleSetTable(knex);
  await createRoutingRuleTable(knex);
  await createRoutingConditionTable(knex);
  await createRoutingConditionValuesTable(knex);
};

exports.down = async function(knex) {
  await knex.schema.dropTable("Routing_ConditionValues");
  await knex.schema.dropTable("Routing_Conditions");
  await knex.schema.dropTable("Routing_Rules");
  await knex.schema.dropTable("Routing_RuleSets");
  await knex.schema.dropTable("Routing_Destinations");
};
