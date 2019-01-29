const { head } = require("lodash/fp");

module.exports = knex => {
  const insert = ({ sideId, optionId }) =>
    knex("Routing2_SelectedOptions")
      .insert({ optionId, sideId })
      .returning("*")
      .then(head);

  const getBySideId = sideId =>
    knex("Routing2_SelectedOptions")
      .select()
      .where({ sideId })
      .orderBy("optionId", "asc");

  const deleteBySideId = sideId =>
    knex("Routing2_SelectedOptions")
      .del()
      .where({ sideId });

  const deleteByOptionId = optionId =>
    knex("Routing2_SelectedOptions")
      .del()
      .where({ optionId });

  return { insert, getBySideId, deleteBySideId, deleteByOptionId };
};
