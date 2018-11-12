exports.up = knex => {
  return knex.schema.table("Options", table => {
    table.bool("mutuallyExclusive").defaultsTo(false);
  });
};

exports.down = knex => {
  return knex.schema.table("Options", table =>
    table.dropColumn("mutuallyExclusive")
  );
};
