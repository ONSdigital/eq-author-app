exports.up = function(knex) {
  return knex.schema
    .table("Pages", t => {
      t.dropForeign("GroupId");
    })
    .then(() => {
      return knex.schema.renameTable("Groups", "Sections");
    })
    .then(() => {
      return knex.schema.table("Pages", t => {
        t.renameColumn("GroupId", "SectionId");
        t.foreign("SectionId").references("Sections.id").onDelete("CASCADE");
      });
    });
};

exports.down = function(knex) {
  return knex.schema
    .table("Pages", t => {
      t.dropForeign("SectionId");
    })
    .then(() => {
      return knex.schema.renameTable("Sections", "Groups");
    })
    .then(() => {
      return knex.schema.table("Pages", t => {
        t.renameColumn("SectionId", "GroupId");
        t.foreign("GroupId").references("Groups.id").onDelete("CASCADE");
      });
    });
};
