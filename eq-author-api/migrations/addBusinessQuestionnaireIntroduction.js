//This is an auto-generated file.  Do NOT modify the method signature.

const { find } = require("lodash");
const { BUSINESS } = require("../constants/questionnaireTypes");
const {
  createDefaultBusinessSurveyMetadata,
} = require("../utils/defaultMetadata");
const createQuestionnaireIntroduction = require("../utils/createQuestionnaireIntroduction");

module.exports = function addBusinessQuestionnaireIntroduction(questionnaire) {
  if (questionnaire.type !== BUSINESS) {
    return questionnaire;
  }

  const defaultMetadata = createDefaultBusinessSurveyMetadata();
  const metadataToAdd = defaultMetadata
    .filter(({ key }) => !find(questionnaire.metadata, { key }))
    .map((md, index) => ({
      ...md,
      id: `migrated-md-${index}`,
    }));
  questionnaire.metadata = [...questionnaire.metadata, ...metadataToAdd];

  questionnaire.introduction = createQuestionnaireIntroduction(
    questionnaire.metadata
  );
  questionnaire.introduction.id = "questionnaire-introduction";

  return questionnaire;
};
