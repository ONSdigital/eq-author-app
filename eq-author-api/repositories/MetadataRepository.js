const { head } = require("lodash/fp");
const { find, merge } = require("lodash");

const Metadata = require("../db/Metadata");

const {
  defaultTypeValueNames,
  defaultTypeValues,
  defaultValues
} = require("../utils/defaultMetadata");

module.exports.getById = function(id) {
  return Metadata.findById(id).where({ isDeleted: false });
};

module.exports.findAll = function findAll(where = {}) {
  return Metadata.findAll()
    .where({ isDeleted: false })
    .where(where);
};

module.exports.insert = function({ questionnaireId }) {
  return Metadata.create({ questionnaireId }).then(head);
};

module.exports.update = function({ id, key, alias, type, ...values }) {
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

    return Metadata.update(id, update).then(head);
  });
};

module.exports.remove = function(id) {
  return Metadata.update(id, { isDeleted: true }).then(head);
};
