const TABLE = "Questionnaires";
const COLUMN = "createdBy";

exports.up = function(knex) {
  return knex.schema.table(TABLE, table => {
    table
      .string(COLUMN)
      .defaultsTo("")
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table(TABLE, table => {
    table.dropColumn(COLUMN);
  });
};
