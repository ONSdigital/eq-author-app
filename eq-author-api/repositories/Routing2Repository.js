const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ pageId, destinationId }) =>
    knex("Routing2")
      .insert({ pageId, destinationId })
      .returning("*")
      .then(head);

  const getByPageId = pageId =>
    knex("Routing2")
      .select()
      .where({ pageId })
      .first();

  const getById = id =>
    knex("Routing2")
      .select()
      .where({ id })
      .first();

  return {
    insert,
    getByPageId,
    getById
  };
};
