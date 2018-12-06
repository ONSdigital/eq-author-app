const { head } = require("lodash/fp");
const { find, merge } = require("lodash");

const Metadata = require("../db/Metadata");

const {
  defaultTypeValueNames,
  defaultTypeValues,
  defaultValues
} = require("../utils/defaultMetadata");

module.exports = knex => {
  const getById = function(id) {
    return Metadata(knex)
      .findById(id)
      .where({ isDeleted: false });
  };

  const findAll = function findAll(where = {}) {
    return Metadata(knex)
      .findAll()
      .where({ isDeleted: false })
      .where(where);
  };

  const insert = function({ questionnaireId }) {
    return Metadata(knex)
      .create({ questionnaireId })
      .then(head);
  };

  const update = function({ id, key, alias, type, ...values }) {
    return this.getById(id).then(current => {
      const update = {
        id,
        key,
        alias,
        type,
        value: values[defaultTypeValueNames[type]]
      };

      if (current.type !== type && !update.value) {
        update.value = defaultTypeValues[type];
      }

      if (current.key !== key) {
        merge(update, find(defaultValues, { key }));
      }

      return Metadata(knex)
        .update(id, update)
        .then(head);
    });
  };

  const remove = function(id) {
    return Metadata(knex)
      .update(id, { isDeleted: true })
      .then(head);
  };

  return {
    getById,
    findAll,
    insert,
    update,
    remove
  };
};
