module.exports = knex => {
  const findById = id =>
    knex("QuestionConfirmations")
      .where("id", parseInt(id, 10))
      .andWhere({ isDeleted: false })
      .first();

  const findByPageId = pageId =>
    knex("QuestionConfirmations")
      .where("pageId", parseInt(pageId, 10))
      .andWhere({ isDeleted: false })
      .first();

  const update = ({ id, ...updates }) =>
    knex("QuestionConfirmations")
      .where("id", parseInt(id, 10))
      .update(updates)
      .returning("*");

  const create = confirmation =>
    knex("QuestionConfirmations")
      .insert(confirmation)
      .returning("*");

  const remove = ({ id }) =>
    knex("QuestionConfirmations")
      .where("id", parseInt(id, 10))
      .update({ isDeleted: true })
      .returning("*");

  const restore = async id => {
    const { pageId } = await knex("QuestionConfirmations")
      .where("id", id)
      .first();
    await knex("QuestionConfirmations")
      .where("pageId", pageId)
      .update({ isDeleted: true });

    return knex("QuestionConfirmations")
      .where("id", parseInt(id, 10))
      .update({ isDeleted: false })
      .returning("*");
  };

  return {
    findById,
    findByPageId,
    update,
    create,
    delete: remove,
    restore,
  };
};
