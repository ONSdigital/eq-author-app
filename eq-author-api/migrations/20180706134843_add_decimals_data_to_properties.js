exports.up = function(knex) {
  return knex.schema.raw(`
    UPDATE "Answers"
    SET properties = json_build_object(
      'required', (properties->>'required')::boolean,
      'decimals', 0
    )::jsonb
    WHERE type IN ('Number', 'Currency');
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    UPDATE "Answers"
    SET properties = json_build_object(
        'required', (properties->>'required')::boolean
    )::jsonb
    WHERE type IN ('Number', 'Currency');
  `);
};
