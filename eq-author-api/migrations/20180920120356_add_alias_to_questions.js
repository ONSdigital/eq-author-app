exports.up = async function(knex) {
  await knex.schema.table("Pages", table => table.string("alias"));
  await knex.raw(`DROP VIEW "PagesView"`);
  return knex.raw(`
    CREATE OR REPLACE VIEW "PagesView" AS (
      SELECT *, ROW_NUMBER () OVER (
        PARTITION BY "sectionId"
        ORDER BY "order" ASC
      ) - 1 AS "position"
      FROM "Pages"
      WHERE "isDeleted" = false
    )`);
};

exports.down = async function() {
  return Promise.resolve();
};
