const db = require("./");

const QuestionConfirmation = () => db("QuestionConfirmations");

const findById = id =>
  QuestionConfirmation()
    .where("id", parseInt(id, 10))
    .andWhere({ isDeleted: false })
    .first();

const findByPageId = pageId =>
  QuestionConfirmation()
    .where("pageId", parseInt(pageId, 10))
    .andWhere({ isDeleted: false })
    .first();

const update = ({ id, ...updates }) =>
  QuestionConfirmation()
    .where("id", parseInt(id, 10))
    .update(updates)
    .returning("*");

const create = confirmation =>
  QuestionConfirmation()
    .insert(confirmation)
    .returning("*");

const remove = ({ id }) =>
  QuestionConfirmation()
    .where("id", parseInt(id, 10))
    .update({ isDeleted: true })
    .returning("*");

const restore = async id => {
  const { pageId } = await QuestionConfirmation()
    .where("id", id)
    .first();
  await QuestionConfirmation()
    .where("pageId", pageId)
    .update({ isDeleted: true });

  return QuestionConfirmation()
    .where("id", parseInt(id, 10))
    .update({ isDeleted: false })
    .returning("*");
};

module.exports = {
  findById,
  findByPageId,
  update,
  create,
  delete: remove,
  restore
};
