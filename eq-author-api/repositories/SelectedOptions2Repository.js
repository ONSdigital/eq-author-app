const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ sideId, optionId }) =>
    knex("SelectedOptions2")
      .insert({ optionId, sideId })
      .returning("*")
      .then(head);

  const getBySideId = sideId =>
    knex("SelectedOptions2")
      .select()
      .where({ sideId })
      .orderBy("optionId", "asc");

  const deleteBySideId = sideId =>
    knex("SelectedOptions2")
      .del()
      .where({ sideId });

  return { insert, getBySideId, deleteBySideId };
};
