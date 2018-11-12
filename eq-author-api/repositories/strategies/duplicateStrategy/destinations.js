const { flatten, omit, get } = require("lodash/fp");

const DESTINATION_CONFIG = [
  { table: "Routing_RuleSets", name: "routingRuleSets" },
  { table: "Routing_Rules", name: "routingRules" }
];

const getDestinationEntities = async (trx, references, { table, name }) => {
  const duplicatedEntities = references[name];
  if (!duplicatedEntities) {
    return [];
  }

  return trx
    .select("id", "routingDestinationId")
    .from(table)
    .whereIn("id", Object.values(references[name]))
    .andWhere("isDeleted", false);
};

const updateDestinationEntities = async (
  trx,
  destLookup,
  entities,
  { table }
) => {
  for (let i = 0; i < entities.length; ++i) {
    const { id, routingDestinationId } = entities[i];
    await trx
      .table(table)
      .where({ id })
      .update({
        routingDestinationId: destLookup[routingDestinationId]
      });
  }
};

const duplicateDestinations = async (trx, references) => {
  const destinationEntities = await Promise.all(
    DESTINATION_CONFIG.map(config =>
      getDestinationEntities(trx, references, config)
    )
  );

  const allIds = flatten(destinationEntities).map(get("routingDestinationId"));

  const destinations = await trx
    .select("*")
    .from("Routing_Destinations")
    .whereIn("id", allIds);

  const updatedDestinations = destinations.map(dest => ({
    ...omit("id")(dest),
    pageId: references.pages[dest.pageId] || dest.pageId,
    sectionId: references.sections[dest.sectionId] || dest.sectionId
  }));

  const newDestinations = await trx
    .insert(updatedDestinations)
    .into("Routing_Destinations")
    .returning("id");

  const oldDestIdToNewDestId = destinations.reduce(
    (map, { id }, index) => ({ ...map, [id]: newDestinations[index] }),
    {}
  );

  return Promise.all(
    DESTINATION_CONFIG.map((config, idx) =>
      updateDestinationEntities(
        trx,
        oldDestIdToNewDestId,
        destinationEntities[idx],
        config
      )
    )
  );
};

module.exports = duplicateDestinations;
