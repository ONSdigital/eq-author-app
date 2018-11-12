exports.up = function(knex) {
  return knex.schema.raw(`
    UPDATE "Answers"
    SET properties = json_build_object(
        'required', mandatory
    )::jsonb;
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    UPDATE "Answers"
    SET mandatory = (properties->>'required')::boolean
  `);
};
