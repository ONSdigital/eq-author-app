const OTHER_ANSWER_ID_COL_NAME = "parentAnswerId";

exports.up = async function(knex) {
  await knex.schema.table("Answers", function(table) {
    table.integer(OTHER_ANSWER_ID_COL_NAME).unsigned();
    table
      .foreign(OTHER_ANSWER_ID_COL_NAME)
      .references("Answers.id")
      .onDelete("CASCADE");
  });
};

exports.down = async function(knex) {
  await knex.schema.table("Answers", function(table) {
    table.dropForeign(OTHER_ANSWER_ID_COL_NAME);
    table.dropColumn(OTHER_ANSWER_ID_COL_NAME);
  });
};
