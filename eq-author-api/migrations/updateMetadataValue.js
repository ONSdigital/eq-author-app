//This is an auto-generated file.  Do NOT modify the method signature.
const { defaultTypeValueNames } = require("../utils/defaultMetadata");

module.exports = function updateMetadataValue(questionnaire) {
  questionnaire.metadata.map((metadata) => {
    if (!metadata.value) {
      return;
    }
    metadata[defaultTypeValueNames[metadata.type]] = metadata.value;
    delete metadata.value;
  });
  return questionnaire;
};
