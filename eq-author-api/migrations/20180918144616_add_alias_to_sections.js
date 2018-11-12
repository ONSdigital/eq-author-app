exports.up = async function(knex) {
  await knex.schema.table("Sections", table => table.string("alias"));
  await knex.raw(`DROP VIEW "SectionsView"`);
  return knex.raw(`
    CREATE OR REPLACE VIEW "SectionsView" AS (
      SELECT *, ROW_NUMBER () OVER (
        PARTITION BY "questionnaireId"
        ORDER BY "order" ASC
      ) - 1 AS "position"
      FROM "Sections"
      WHERE "isDeleted" = false
    )`);
};

exports.down = async function() {
  return Promise.resolve();
};
