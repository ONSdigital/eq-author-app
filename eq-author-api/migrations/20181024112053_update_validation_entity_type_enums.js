const { noop } = require("lodash");
const formatAlterTableEnumSql = require("../utils/migrateEnumChecks");
const {
  CUSTOM,
  PREVIOUS_ANSWER,
  METADATA
} = require("../constants/validationEntityTypes");

exports.up = async function(knex) {
  return knex.raw(
    formatAlterTableEnumSql("Validation_AnswerRules", "entityType", [
      CUSTOM,
      PREVIOUS_ANSWER,
      METADATA
    ])
  );
};

exports.down = noop;
