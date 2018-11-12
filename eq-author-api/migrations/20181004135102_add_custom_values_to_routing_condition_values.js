const formatAlterTableEnumSql = require("../utils/migrateEnumChecks");
const { noop } = require("lodash");

exports.up = async function(knex) {
  await knex.raw(
    formatAlterTableEnumSql("Routing_Conditions", "comparator", [
      "Equal",
      "NotEqual",
      "GreaterThan",
      "LessThan",
      "GreaterOrEqual",
      "LessOrEqual"
    ])
  );
  return knex.schema.table("Routing_ConditionValues", table => {
    table.integer("customNumber").defaultsTo(null);
  });
};

exports.down = noop;
