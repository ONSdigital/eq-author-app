const { getOptions } = require("../schema/resolvers/utils");

module.exports = (questionnaire) => {
  const allQuestionnaireOptions = getOptions({ questionnaire });

  if (questionnaire.collectionLists?.lists?.length > 0) {
    questionnaire.allowableDataVersions = ["3"];
  } else if (questionnaire.supplementaryData) {
    questionnaire.allowableDataVersions = ["3"];
  } else if (allQuestionnaireOptions?.some((option) => option.dynamicAnswer)) {
    questionnaire.allowableDataVersions = ["3"];
  } else {
    questionnaire.allowableDataVersions = ["1", "3"];
  }

  return questionnaire;
};
