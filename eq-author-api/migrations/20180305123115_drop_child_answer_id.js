const CHILD_ANSWER_ID_COL_NAME = "childAnswerId";

exports.up = async function(knex) {
  await knex.schema.table("Options", function(table) {
    table.dropColumn(CHILD_ANSWER_ID_COL_NAME);
  });
};

exports.down = async function(knex) {
  await knex.schema.table("Options", function(table) {
    table.integer(CHILD_ANSWER_ID_COL_NAME);
  });
};
