const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ routingId, destinationId }) =>
    knex("Routing2_Rules")
      .insert({ routingId, destinationId })
      .returning("*")
      .then(head);

  const getByRoutingId = routingId =>
    knex("Routing2_Rules")
      .select("*")
      .where({ routingId });

  const getById = id =>
    knex("Routing2_Rules")
      .select("*")
      .where({ id })
      .first();

  const del = id =>
    knex("Routing2_Rules")
      .where({ id })
      .delete()
      .returning("*")
      .then(head);

  return {
    insert,
    getByRoutingId,
    getById,
    delete: del
  };
};
