exports.up = function(knex) {
  return knex.schema.table("Pages", table => {
    table.index(["SectionId"]);
  });
};

exports.down = function(knex) {
  return knex.schema.table("Pages", table => {
    table.dropIndex(["SectionId"]);
  });
};
