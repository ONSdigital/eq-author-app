const { noop } = require("lodash");

exports.up = function(knex) {
  return knex.schema.table("Options", t =>
    t.renameColumn("otherAnswerId", "additionalAnswerId")
  );
};

exports.down = noop;
