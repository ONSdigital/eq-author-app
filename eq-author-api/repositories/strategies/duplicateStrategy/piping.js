const cheerio = require("cheerio");

const PIPING_LOCATIONS = [
  {
    entityName: "pages",
    table: "Pages",
    fields: ["title", "description", "guidance"]
  },
  {
    entityName: "sections",
    table: "Sections",
    fields: ["introductionTitle", "introductionContent"]
  }
];

const updatePipingField = references => field => {
  if (!field || field.indexOf("<span") === -1) {
    return field;
  }

  const $ = cheerio.load(field);

  $("span").map((i, el) => {
    const $el = $(el);
    const pipeType = $el.data("piped");
    const id = $el.data("id");

    const newId = references[pipeType][id];
    $el.attr("data-id", newId);

    return $.html($el);
  });

  return $("body").html();
};

const updateEntityPiping = async (
  trx,
  references,
  updateField,
  { entityName, table, fields }
) => {
  const ids = Object.values(references[entityName] || {});
  if (ids.length === 0) {
    return;
  }

  const entities = await trx
    .select("*")
    .from(table)
    .whereIn("id", ids)
    .andWhere(builder => {
      fields.forEach(field => {
        builder.orWhere(field, "like", "%<%");
      });
    });

  for (let i = 0; i < entities.length; ++i) {
    const entity = entities[i];
    const modifiedEntity = fields.reduce(
      (obj, field) => ({
        ...obj,
        [field]: updateField(entity[field])
      }),
      {}
    );
    await trx
      .table(table)
      .update(modifiedEntity)
      .where({ id: entity.id });
  }
};

const updatePiping = async (trx, references) => {
  const updatePipingFieldWithRef = updatePipingField(references);

  return Promise.all(
    PIPING_LOCATIONS.map(entityConfig =>
      updateEntityPiping(
        trx,
        references,
        updatePipingFieldWithRef,
        entityConfig
      )
    )
  );
};

module.exports = updatePiping;
