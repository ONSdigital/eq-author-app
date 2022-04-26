const { enableOn } = require("../utils/featureFlag");

module.exports = (questionnaire) => {
  questionnaire.hub = false;
  if (enableOn(["hub"])) {
    questionnaire.hub = questionnaire.sections.length > 1;
  }

  return questionnaire;
};
