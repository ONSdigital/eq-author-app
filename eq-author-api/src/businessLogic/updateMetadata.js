const {
  defaultTypeValueNames,
  defaultTypeValues,
  defaultValues,
} = require("../../utils/defaultMetadata");

const { merge, find } = require("lodash/fp");

module.exports = (
  metadataToUpdate,
  { key, fallbackKey, alias, type, ...values }
) => {
  let newValues = {
    key,
    fallbackKey,
    alias,
    type,
    textValue: null,
    regionValue: null,
    dateValue: null,
    languageValue: null,
    [defaultTypeValueNames[type]]: values[defaultTypeValueNames[type]],
  };

  if (
    metadataToUpdate.type !== type &&
    !newValues[defaultTypeValueNames[type]]
  ) {
    newValues[defaultTypeValueNames[type]] = defaultTypeValues[type];
  }

  if (metadataToUpdate.key !== key) {
    newValues = merge(newValues, find({ key }, defaultValues));
  }

  if (type !== metadataToUpdate.type) {
    newValues.fallbackKey = null;
  }

  return {
    ...metadataToUpdate,
    ...newValues,
  };
};
