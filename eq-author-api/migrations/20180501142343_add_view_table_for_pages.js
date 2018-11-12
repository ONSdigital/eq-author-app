exports.up = function(knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW "PagesView" AS (
      SELECT *, ROW_NUMBER () OVER (
        PARTITION BY "SectionId"
        ORDER BY "order" ASC
      ) - 1 AS "position"
      FROM "Pages"
      WHERE "isDeleted" = false
    )
  `);
};

exports.down = function(knex) {
  return knex.raw(`DROP VIEW "PagesView"`);
};
