exports.up = function(knex) {
  return knex.raw(`
        CREATE OR REPLACE VIEW "CompositeAnswerView" AS (
          select id::text, label, 
              "type", "QuestionPageId", "isDeleted", description, guidance,"qCode",
              "parentAnswerId", created_at, updated_at
          from "Answers" where "type" not in ('DateRange')
          union
              select concat(id, 'from') as id, label, 
                  "type", "QuestionPageId", "isDeleted", description, guidance,"qCode",
                  "parentAnswerId", created_at, updated_at
                  from "Answers" where "type" in ('DateRange')
          union
              select concat(id, 'to') as id, "secondaryLabel" as label, 
                "type", "QuestionPageId", "isDeleted", description, guidance, "qCode", 
                "parentAnswerId", created_at, updated_at
              from "Answers" where "type" in ('DateRange')
        )
      `);
};

exports.down = function(knex) {
  return knex.raw(`DROP VIEW "CompositeAnswerView"`);
};
