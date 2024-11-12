const createValidationError = require("../createValidationError");
const {
  ERR_SURVEY_ID_MISMATCH,
  ERR_INVALID,
  ERR_VALID_REQUIRED,
} = require("../../../constants/validationErrorCodes");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "validateSurveyId",
    validate: function isValid(
      _schema,
      questionnaireSurveyId, // gives the data entered into the survey ID field
      _parentSchema,
      {
        instancePath, // gives the path /surveyId
        rootData: questionnaire, // gives the whole questionnaire object
        parentDataProperty: fieldName, // gives the field name surveyId
      }
    ) {
      // Get the supplementary data from the questionnaire object
      const supplementaryData = questionnaire.supplementaryData;

      if (
        typeof questionnaire.surveyId === "string" &&
        questionnaire.surveyId.length === 0
      ) {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            ERR_VALID_REQUIRED,
            questionnaire,
            ERR_VALID_REQUIRED
          ),
        ];
        return false;
      } else {
        if (
          typeof questionnaire.surveyId === "string" &&
          questionnaire.surveyId.length > 0 &&
          !questionnaire.surveyId.match(/^\d{3}$/)
        ) {
          isValid.errors = [
            createValidationError(
              instancePath,
              fieldName,
              ERR_INVALID,
              questionnaire,
              ERR_INVALID
            ),
          ];
          return false;
          // If supplementaryData exists and contains a surveyId, and supplementaryData's surveyId doesn't match the questionnaire's surveyId, throw a validation error
        } else if (
          supplementaryData &&
          supplementaryData.surveyId &&
          questionnaireSurveyId !== supplementaryData.surveyId
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
      }
    },
  });
