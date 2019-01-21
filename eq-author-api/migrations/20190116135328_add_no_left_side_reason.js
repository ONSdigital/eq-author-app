const { noop } = require("lodash");
const migrateEnumChecks = require("../utils/migrateEnumChecks");
const {
  SELECTED_ANSWER_DELETED,
  NO_ROUTABLE_ANSWER_ON_PAGE,
  NULL,
} = require("../constants/routingNoLeftSide");

exports.up = async knex => {
  await knex.schema.table("Routing2_LeftSides", table =>
    table.enum("nullReason", [
      SELECTED_ANSWER_DELETED,
      NO_ROUTABLE_ANSWER_ON_PAGE,
      NULL,
    ])
  );

  await knex.raw(
    migrateEnumChecks("Routing2_LeftSides", "type", ["Answer", "Null"])
  );
};

exports.down = noop;
