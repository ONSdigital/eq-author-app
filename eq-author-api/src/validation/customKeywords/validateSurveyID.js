const {
  ERR_INVALID_SURVEY_ID,
} = require("../../../constants/validationErrorCodes");
const createValidationError = require("../createValidationError");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "validateSurveyID",
    $data: true,
    validate: function isValid(
      _schema,
      surveyId,
      _parentSchema,
      { parentDataProperty: fieldName, instancePath, rootData: questionnaire }
    ) {
      const ctx = {
        questionnaire,
      };
      const surveyID = ctx.questionnaire.surveyId;
      const SDS = ctx.questionnaire.supplementaryData;
      const sdsSurveyID = ctx.questionnaire.supplementaryData.surveyId;

      if (SDS) {
        if (surveyID !== sdsSurveyID) {
          isValid.errors = [
            createValidationError(
              instancePath,
              fieldName,
              ERR_INVALID_SURVEY_ID,
              questionnaire
            ),
          ];
          return false;
        } else {
          return true;
        }
      }
    },
  });
