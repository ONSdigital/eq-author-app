const { noop } = require("lodash");
const migrateEnumChecks = require("../utils/migrateEnumChecks");
const { DATE_RANGE } = require("../constants/answerTypes");

exports.up = async function(knex, Promise) {
  await knex.raw(
    migrateEnumChecks("Validation_AnswerRules", "validationType", [
      "minValue",
      "maxValue",
      "earliestDate",
      "latestDate",
      "minDuration",
      "maxDuration"
    ])
  );

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
        validationType: "minDuration",
        config: {
          duration: {
            value: 0,
            unit: "Days"
          }
        }
      },
      {
        answerId: id,
        validationType: "maxDuration",
        config: {
          duration: {
            value: 0,
            unit: "Days"
          }
        }
      }
    ])
  );

  return Promise.all(inserts);
};

exports.down = noop;
