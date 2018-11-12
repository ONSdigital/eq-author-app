exports.up = async function(knex) {
  await knex.schema.table("Options", table => {
    table.integer("otherAnswerId").unsigned();
    table
      .foreign("otherAnswerId")
      .references("Answers.id")
      .onDelete("CASCADE");
  });
};

exports.down = async function(knex) {
  await knex.schema.table("Options", table => {
    table.dropForeign("otherAnswerId");
    table.dropColumn("otherAnswerId");
  });
};
