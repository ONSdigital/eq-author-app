exports.up = knex => {
  return knex.schema.table("Answers", table => {
    table.string("secondaryLabel");
  });
};

exports.down = knex => {
  return knex.schema.table("Answers", table =>
    table.dropColumn("secondaryLabel")
  );
};
