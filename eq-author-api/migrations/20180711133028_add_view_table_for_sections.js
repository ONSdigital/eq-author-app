exports.up = function(knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW "SectionsView" AS (
      SELECT *, ROW_NUMBER () OVER (
        PARTITION BY "QuestionnaireId"
        ORDER BY "order" ASC
      ) - 1 AS "position"
      FROM "Sections"
      WHERE "isDeleted" = false
    )
  `);
};

exports.down = function(knex) {
  return knex.raw(`DROP VIEW "SectionsView"`);
};
