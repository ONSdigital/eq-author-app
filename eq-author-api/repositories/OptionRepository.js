const { head, isNil } = require("lodash/fp");
const Option = require("../db/Option");

module.exports = knex => {
  const findExclusiveOptionByAnswerId = answerId =>
    Option(knex)
      .findAll()
      .where({
        mutuallyExclusive: true,
        answerId,
      })
      .then(head);

  const checkForExistingExclusive = async answerId => {
    const existingExclusive = await findExclusiveOptionByAnswerId(answerId);
    if (!isNil(existingExclusive)) {
      throw new Error("There is already an exclusive checkbox on this answer.");
    }
  };

  const findAll = (where = {}, orderBy = "id", direction = "asc") =>
    Option(knex)
      .findAll()
      .where({ isDeleted: false })
      .where(where)
      .orderBy(orderBy, direction);

  const getById = id =>
    Option(knex)
      .findById(id)
      .where({ isDeleted: false });

  const insert = async ({
    label,
    description,
    value,
    qCode,
    answerId,
    mutuallyExclusive = false,
    additionalAnswerId,
  }) => {
    if (mutuallyExclusive) {
      await checkForExistingExclusive(answerId);
    }
    return Option(knex)
      .create({
        label,
        description,
        value,
        qCode,
        answerId,
        mutuallyExclusive,
        additionalAnswerId,
      })
      .then(head);
  };

  const update = ({ id, label, description, value, qCode, isDeleted }) =>
    Option(knex)
      .update(id, {
        label,
        description,
        value,
        qCode,
        isDeleted,
      })
      .then(head);

  const deleteOption = async (trx, id) => {
    const deletedOption = await trx("Options")
      .where({
        id: parseInt(id),
      })
      .update({
        isDeleted: true,
      })
      .returning("*")
      .then(head);

    return deletedOption;
  };

  const remove = id => knex.transaction(trx => deleteOption(trx, id));

  const undelete = id =>
    Option(knex)
      .update(id, { isDeleted: false })
      .then(head);

  return {
    findAll,
    findExclusiveOptionByAnswerId,
    getById,
    insert,
    update,
    remove,
    undelete,
  };
};
