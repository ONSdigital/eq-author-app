const {
  defaultTypeValueNames,
  defaultTypeValues,
  defaultValues,
} = require("../../utils/defaultMetadata");

const { merge, find } = require("lodash/fp");

module.exports = (metadataToUpdate, { key, alias, type, ...values }) => {
  let newValues = {
    key,
    alias,
    type,
    value: values[defaultTypeValueNames[type]],
  };

  if (metadataToUpdate.type !== type && !newValues.value) {
    newValues.value = defaultTypeValues[type];
  }

  if (metadataToUpdate.key !== key) {
    newValues = merge(newValues, find({ key }, defaultValues));
  }

  return {
    ...metadataToUpdate,
    ...newValues,
  };
};
