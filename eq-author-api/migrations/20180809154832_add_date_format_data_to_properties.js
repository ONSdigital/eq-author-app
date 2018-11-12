exports.up = function(knex) {
  return knex.schema.raw(`
      UPDATE "Answers"
      SET properties = json_build_object(
        'required', (properties->>'required')::boolean,
        'format', 'dd/mm/yyyy'
      )::jsonb
      WHERE type IN ('Date');
    `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
      UPDATE "Answers"
      SET properties = json_build_object(
          'required', (properties->>'required')::boolean
      )::jsonb
      WHERE type IN ('Date');
    `);
};
