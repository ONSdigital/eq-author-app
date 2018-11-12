exports.up = function(knex) {
  return knex.raw(`
    UPDATE "Sections"
    SET "order" = s.position
    FROM (
      SELECT id, ROW_NUMBER () OVER (
        PARTITION BY "QuestionnaireId"
        ORDER BY id
      ) * 1000 as "position"
      FROM "Sections"
    ) s
    WHERE "Sections".id = s.id
  `);
};

exports.down = function(knex) {
  return knex("Sections").update({ order: 0 });
};
