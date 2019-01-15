const { noop } = require("lodash");
const { DATE_RANGE } = require("../constants/answerTypes");

exports.up = async function(knex, Promise) {
  const answersWithId = await knex
    .select("Answers.id")
    .from("Answers")
    .where({ type: DATE_RANGE });

  const ids = answersWithId.map(({ id }) => id);

  await knex("Validation_AnswerRules")
    .whereIn("answerId", ids)
    .del();

  const inserts = ids.map(id =>
    knex("Validation_AnswerRules").insert([
      {
        answerId: id,
        validationType: "earliestDate",
        config: {
          offset: {
            value: 0,
            unit: "Days",
          },
          relativePosition: "Before",
        },
      },
      {
        answerId: id,
        validationType: "latestDate",
        config: {
          offset: {
            value: 0,
            unit: "Days",
          },
          relativePosition: "After",
        },
      },
    ])
  );

  return Promise.all(inserts);
};

exports.down = noop;
