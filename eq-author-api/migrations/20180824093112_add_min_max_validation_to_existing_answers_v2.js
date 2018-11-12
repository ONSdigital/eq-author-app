const { flatMap } = require("lodash");

exports.up = async function(knex) {
  await knex("Validation_AnswerRules").del();

  const ids = await knex
    .select("Answers.id")
    .from("Answers")
    .where(function() {
      this.where({ type: "Currency" }).orWhere({ type: "Number" });
    });

  const result = flatMap(ids, ({ id }) => {
    return ["minValue", "maxValue"].map(validationType => {
      return knex("Validation_AnswerRules").insert({
        AnswerId: id,
        validationType,
        config: { inclusive: false }
      });
    });
  });

  return Promise.all(result);
};

exports.down = async function() {
  /*
  This migration will not have a rollback mechanism as due to the addition of specific data 
  it is not possible to re-identity that data to delete it in a rollback action.
  */
};
