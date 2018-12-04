const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = () =>
    knex("Routing2_Destinations")
      .insert({ logical: "NextPage" })
      .returning("*")
      .then(head);

  const getById = id =>
    knex("Routing2_Destinations")
      .select()
      .where({ id })
      .first();

  const update = ({ id, pageId = null, sectionId = null, logical = null }) =>
    knex("Routing2_Destinations")
      .where({ id })
      .update({ pageId, sectionId, logical })
      .returning("*")
      .then(head);

  return {
    insert,
    getById,
    update
  };
};
