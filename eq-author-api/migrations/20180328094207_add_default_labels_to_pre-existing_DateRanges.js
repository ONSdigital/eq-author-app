exports.up = function(knex) {
  return knex("Answers")
    .where({ type: "DateRange" })
    .update({ label: "Period from", secondaryLabel: "Period to" });
};

exports.down = function(knex) {
  return knex("Answers")
    .where({ type: "DateRange" })
    .update({ label: null, secondaryLabel: null });
};
