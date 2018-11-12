exports.up = async function(knex, Promise) {
  await knex.raw(`DROP VIEW "PagesView"`);

  await knex.raw(`DROP VIEW "SectionsView"`);

  await knex.raw(`DROP VIEW "CompositeAnswerView"`);

  let promiseArray = [];

  promiseArray.push(
    knex.raw(`
    CREATE OR REPLACE VIEW "PagesView" AS (
      SELECT *, ROW_NUMBER () OVER (
        PARTITION BY "sectionId"
        ORDER BY "order" ASC
      ) - 1 AS "position"
      FROM "Pages"
      WHERE "isDeleted" = false
    )
  `)
  );

  promiseArray.push(
    knex.raw(`
    CREATE OR REPLACE VIEW "SectionsView" AS (
      SELECT *, ROW_NUMBER () OVER (
        PARTITION BY "questionnaireId"
        ORDER BY "order" ASC
      ) - 1 AS "position"
      FROM "Sections"
      WHERE "isDeleted" = false
    )
  `)
  );

  promiseArray.push(
    knex.raw(`
    CREATE OR REPLACE VIEW "CompositeAnswerView" AS (
      select id::text, label, 
          "type", "questionPageId", "isDeleted", description, guidance,"qCode",
          "parentAnswerId", "createdAt", "updatedAt"
      from "Answers" where "type" not in ('DateRange')
      union
          select concat(id, 'from') as id, label, 
              "type", "questionPageId", "isDeleted", description, guidance,"qCode",
              "parentAnswerId", "createdAt", "updatedAt"
              from "Answers" where "type" in ('DateRange')
      union
          select concat(id, 'to') as id, "secondaryLabel" as label, 
            "type", "questionPageId", "isDeleted", description, guidance, "qCode", 
            "parentAnswerId", "createdAt", "updatedAt"
          from "Answers" where "type" in ('DateRange')
    )
  `)
  );

  return Promise.all(promiseArray);
};

exports.down = async function(knex) {
  await knex.raw(`DROP VIEW "PagesView"`);

  await knex.raw(`DROP VIEW "SectionsView"`);

  await knex.raw(`DROP VIEW "CompositeAnswerView"`);
};
