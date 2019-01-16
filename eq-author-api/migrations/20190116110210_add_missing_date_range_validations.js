const { noop } = require("lodash");
const { DATE_RANGE } = require("../constants/answerTypes");

exports.up = async knex => {
  // Assuming missing latest if also missing earlist
  const answersWhereMissingEarliestValidation = await knex.raw(`
    select
      a.id
    from
      "Answers" a
      left outer join "Validation_AnswerRules" varEarliest
        on a.id = varEarliest."answerId"
        and varEarliest."validationType" = 'earliestDate'
    where
      varEarliest."answerId" is null
      and a.type = '${DATE_RANGE}'
  `);

  const ids = answersWhereMissingEarliestValidation.rows.map(({ id }) => id);

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
