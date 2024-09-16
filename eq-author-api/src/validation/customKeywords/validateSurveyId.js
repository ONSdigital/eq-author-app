const createValidationError = require("../createValidationError");
const {
  ERR_SURVEY_ID_MISMATCH,
} = require("../../../constants/validationErrorCodes");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "validateSurveyID",
    validate: function isValid(
      _schema,
      _questionnaireSurveyId, // gives the data entered into the survey ID field
      _parentSchema,
      {
        instancePath, // gives the path /surveyId
        rootData: questionnaire, // gives the whole questionnaire object
        parentDataProperty: fieldName, // gives the field name surveyId
      }
    ) {
      // Get the supplementary data from the questionnaire object
      const supplementaryData = questionnaire.supplementaryData;

      // If supplementaryData is not available or doesn't contain surveyId, or if surveyId doesn't match, throw an error
      if (
        supplementaryData &&
        supplementaryData.surveyId &&
        _questionnaireSurveyId !== supplementaryData.surveyId
      ) {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            ERR_SURVEY_ID_MISMATCH,
            questionnaire,
            ERR_SURVEY_ID_MISMATCH
          ),
        ];
        return false;
      }

      return true;
    },
  });
