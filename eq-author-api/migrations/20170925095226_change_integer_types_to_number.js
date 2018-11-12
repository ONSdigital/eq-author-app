exports.up = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "Answers"
    DROP CONSTRAINT "Answers_type_check",
    ADD CONSTRAINT "Answers_type_check" 
    CHECK (type IN ('Checkbox', 
    'Currency', 
    'Date', 
    'MonthYearDate', 
    'Number', 
    'Percentage', 
    'Radio', 
    'TextArea', 
    'TextField', 
    'Relationship'))
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "Answers"
    DROP CONSTRAINT "Answers_type_check",
    ADD CONSTRAINT "Answers_type_check" 
    CHECK (type IN ('Checkbox', 
    'Currency', 
    'Date', 
    'MonthYearDate', 
    'Integer', 
    'Percentage', 
    'PositiveInteger', 
    'Radio', 
    'TextArea', 
    'TextField', 
    'Relationship'))
  `);
};
