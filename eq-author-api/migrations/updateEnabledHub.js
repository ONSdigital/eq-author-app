const { enableOn } = require("../utils/featureFlag");

module.exports = (questionnaire) => {
  process.env.FEATURE_FLAGS = "hub";
  if (enableOn(["hub"])) {
    questionnaire.hub = questionnaire.sections.length > 1;
  }

  return questionnaire;
};
