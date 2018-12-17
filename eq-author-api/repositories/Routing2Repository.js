const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ pageId, destinationId }) =>
    knex("Routing2_Routing")
      .insert({ pageId, destinationId })
      .returning("*")
      .then(head);

  const getByPageId = pageId =>
    knex("Routing2_Routing")
      .select()
      .where({ pageId })
      .first();

  const getById = id =>
    knex("Routing2_Routing")
      .select()
      .where({ id })
      .first();

  return {
    insert,
    getByPageId,
    getById
  };
};
