const formatAlterTableEnumSql = (tableName, columnName, enums) => {
  const constraintName = `${tableName}_${columnName}_check`;
  return [
    `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "${constraintName}";`,
    `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintName}" CHECK ("${columnName}" = ANY (ARRAY['${enums.join(
      "'::text, '"
    )}'::text]));`
  ].join("\n");
};

exports.up = async function(knex) {
  await knex.raw(
    formatAlterTableEnumSql("Validation_AnswerRules", "validationType", [
      "minValue",
      "maxValue",
      "earliestDate",
      "latestDate"
    ])
  );

  const ids = await knex
    .select("Answers.id")
    .from("Answers")
    .where({ type: "Date" });

  const inserts = ids.map(({ id }) =>
    knex("Validation_AnswerRules").insert({
      AnswerId: id,
      validationType: "latestDate",
      config: {
        offset: {
          value: 0,
          unit: "Days"
        },
        relativePosition: "Before"
      }
    })
  );
  return Promise.resolve(inserts);
};

exports.down = function() {
  return Promise.resolve();
};
