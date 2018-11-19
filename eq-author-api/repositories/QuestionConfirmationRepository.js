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

const findById = id => QuestionConfirmation.findById(id);

const findByPageId = pageId => QuestionConfirmation.findByPageId(pageId);

const create = async ({ pageId }) => {
  const existing = await findByPageId(pageId);
  if (existing) {
    throw new Error(
      `Cannot create a question confirmation as one already exists for page: ${pageId}`
    );
  }
  return QuestionConfirmation.create({ pageId }).then(head);
};

const update = confirmation =>
  QuestionConfirmation.update(sanitise(confirmation)).then(head);

const remove = confirmation =>
  QuestionConfirmation.delete(confirmation).then(head);

const restore = id => QuestionConfirmation.restore(id).then(head);

module.exports = {
  findById,
  findByPageId,
  create,
  update,
  delete: remove,
  restore
};
