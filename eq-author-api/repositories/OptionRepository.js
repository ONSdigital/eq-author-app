const { head, isNil } = require("lodash/fp");
const Option = require("../db/Option");
const db = require("../db");
const { handleOptionDeleted } = require("./strategies/routingStrategy");

const findExclusiveOptionByAnswerId = answerId =>
  Option.findAll()
    .where({
      isDeleted: false,
      otherAnswerId: null,
      mutuallyExclusive: true,
      answerId
    })
    .then(head);

const checkForExistingExclusive = async answerId => {
  const existingExclusive = await findExclusiveOptionByAnswerId(answerId);
  if (!isNil(existingExclusive)) {
    throw new Error("There is already an exclusive checkbox on this answer.");
  }
};

const findAll = (where = {}, orderBy = "id", direction = "asc") =>
  Option.findAll()
    .where({ isDeleted: false, otherAnswerId: null })
    .where(where)
    .orderBy(orderBy, direction);

const getById = id => Option.findById(id).where({ isDeleted: false });

const insert = async (
  { label, description, value, qCode, answerId, mutuallyExclusive = false },
  trx = db
) => {
  if (mutuallyExclusive) {
    await checkForExistingExclusive(answerId);
  }
  return trx("Options")
    .insert({
      label,
      description,
      value,
      qCode,
      answerId,
      mutuallyExclusive
    })
    .returning("*")
    .then(head);
};

const update = ({ id, label, description, value, qCode, isDeleted }) =>
  Option.update(id, {
    label,
    description,
    value,
    qCode,
    isDeleted
  }).then(head);

const deleteOption = async (trx, id) => {
  const deletedOption = await trx("Options")
    .where({
      id: parseInt(id)
    })
    .update({
      isDeleted: true
    })
    .returning("*")
    .then(head);

  await handleOptionDeleted(trx, id);

  return deletedOption;
};

const remove = id => db.transaction(trx => deleteOption(trx, id));

const undelete = id => Option.update(id, { isDeleted: false }).then(head);

const getOtherOption = (answerId, orderBy = "createdAt", direction = "asc") =>
  Option.findAll()
    .where({ isDeleted: false, otherAnswerId: answerId })
    .orderBy(orderBy, direction)
    .first();

Object.assign(module.exports, {
  findAll,
  findExclusiveOptionByAnswerId,
  getById,
  insert,
  update,
  remove,
  undelete,
  getOtherOption
});
