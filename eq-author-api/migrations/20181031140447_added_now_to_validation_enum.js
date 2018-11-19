const formatAlterTableEnumSql = require("../utils/migrateEnumChecks");
const { noop } = require("lodash");
const {
  CUSTOM,
  PREVIOUS_ANSWER,
  METADATA,
  NOW
} = require("../constants/validationEntityTypes");

exports.up = function(knex) {
  return knex.raw(
    formatAlterTableEnumSql("Validation_AnswerRules", "entityType", [
      CUSTOM,
      PREVIOUS_ANSWER,
      METADATA,
      NOW
    ])
  );
};

exports.down = noop;
