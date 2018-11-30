const { head, pick } = require("lodash/fp");

const QuestionConfirmation = require("../db/QuestionConfirmation");

const USER_MODIFIABLE_FIELDS = [
  "title",
  "positiveLabel",
  "positiveDescription",
  "negativeLabel",
  "negativeDescription"
];

const sanitise = pick(["id", ...USER_MODIFIABLE_FIELDS]);

module.exports = knex => {
  const findById = id => QuestionConfirmation(knex).findById(id);

  const findByPageId = pageId =>
    QuestionConfirmation(knex).findByPageId(pageId);

  const create = async ({ pageId }) => {
    const existing = await findByPageId(pageId);
    if (existing) {
      throw new Error(
        `Cannot create a question confirmation as one already exists for page: ${pageId}`
      );
    }
    return QuestionConfirmation(knex)
      .create({ pageId })
      .then(head);
  };

  const update = confirmation =>
    QuestionConfirmation(knex)
      .update(sanitise(confirmation))
      .then(head);

  const remove = confirmation =>
    QuestionConfirmation(knex)
      .delete(confirmation)
      .then(head);

  const restore = id =>
    QuestionConfirmation(knex)
      .restore(id)
      .then(head);

  return {
    findById,
    findByPageId,
    create,
    update,
    delete: remove,
    restore
  };
};
