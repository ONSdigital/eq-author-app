exports.up = async function(knex) {
  const ids = await knex
    .select("Answers.id")
    .from("Answers")
    .where(function() {
      this.where({ type: "Currency" }).orWhere({ type: "Number" });
    })
    .leftOuterJoin("Validation_AnswerRules", function() {
      this.on("Validation_AnswerRules.AnswerId", "=", "Answers.id");
    })
    .whereNull("Validation_AnswerRules.id");

  return ids.map(({ id }) => {
    return ["minValue", "maxValue"].map(validationType => {
      return knex("Validation_AnswerRules").insert({
        AnswerId: id,
        validationType,
        config: { inclusive: false }
      });
    });
  });
};

exports.down = async function() {
  /*
  This migration will not have a rollback mechanism as due to the addition of specific data 
  it is not possible to re-identity that data to delete it in a rollback action.
  */
};
