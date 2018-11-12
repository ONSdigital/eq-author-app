const IS_DELETED_COLUMN_NAME = "isDeleted";

const TABLES_TO_CHANGE = [
  "Questionnaires",
  "Sections",
  "Pages",
  "Answers",
  "Options"
];

const addIsDeletedColumn = table =>
  table
    .boolean(IS_DELETED_COLUMN_NAME)
    .notNull()
    .defaultTo(false);

const dropIsDeletedColumn = table => table.dropColumn(IS_DELETED_COLUMN_NAME);

exports.up = function(knex) {
  return Promise.all(
    TABLES_TO_CHANGE.map(t => knex.schema.table(t, addIsDeletedColumn))
  );
};

exports.down = function(knex) {
  return Promise.all(
    TABLES_TO_CHANGE.map(t => knex.schema.table(t, dropIsDeletedColumn))
  );
};
