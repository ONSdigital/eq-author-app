const { noop } = require("lodash");

exports.up = async function(knex) {
  await knex.schema.table("Sections", table => {
    table.string("introductionTitle");
    table.string("introductionContent");
    table.boolean("introductionEnabled").defaultsTo(false);
  });
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

exports.down = noop;
