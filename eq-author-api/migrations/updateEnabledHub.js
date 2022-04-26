const { enableOn } = require("../utils/featureFlag");

module.exports = (questionnaire) => {
  if (enableOn(["hub"])) {
    questionnaire.hub = questionnaire.sections.length > 1;
  }

  return questionnaire;
};
