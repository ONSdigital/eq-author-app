
exports.up = function(knex) {
  return knex.schema.createTable("Pages", function(table) {
    table.increments();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.text("title").notNullable();
    table.text("description");

    table.enum("pageType", [
      "QuestionPage",
      "InterstitialPage"
    ]).notNullable();

    // temporarily subsume the Questions table 
    table.text("guidance");
    table.enum("type", [
      "General",
      "DateRange",
      "RepeatingAnswer",
      "Relationship"
    ]).notNullable();
    table.boolean("mandatory").notNullable().defaultsTo(false);

    table.integer("GroupId")
      .unsigned()
      .index()
      .references("id")
      .inTable("Groups")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("Pages");
};
