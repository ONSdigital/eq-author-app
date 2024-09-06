const createValidationError = require("../createValidationError");
const {
  ERR_SURVEY_ID_MISMATCH,
} = require("../../../constants/validationErrorCodes");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "validateSurveyID",
    validate: function isValid(_schema, data, _parentSchema, ctx) {
      const {
        instancePath,
        parentDataProperty: fieldName,
        rootData: questionnaire,
      } = ctx;

      const surveyID = questionnaire.surveyId;
      const SDS = questionnaire.supplementaryData;

      // If supplementaryData exists, retrieve its surveyId
      const sdsSurveyID = SDS ? SDS.surveyId : null;

      // If supplementaryData exists, compare surveyId values
      if (SDS && surveyID !== sdsSurveyID) {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            ERR_SURVEY_ID_MISMATCH,
            questionnaire
          ),
        ];
        return false;
      }

      // If supplementaryData is missing or surveyIds match, return true
      return true;
    },
  });
