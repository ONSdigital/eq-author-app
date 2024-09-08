const createValidationError = require("../createValidationError");
const {
  ERR_SURVEY_ID_MISMATCH,
} = require("../../../constants/validationErrorCodes");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "validateSurveyID",
    $data: true,
    validate: function isValid(
      schema, // schema true
      data, // gives the data entered into the survey ID field
      parentSchema, // parentSchema { validateSurveyID: true }
      {
        instancePath, // gives the path /surveyId
        rootData: questionnaire, // gives the whole object of questionnaire
        parentData, // gives the whole object of questionnaire
        parentDataProperty: fieldName, // gives the field name surveyId
      }
    ) {
      // console.log("instancePath", instancePath);
      // console.log("schema", schema);
      // console.log("parentSchema", parentSchema);
      console.log("data", data);
      // console.log("questionnaire", questionnaire.supplementaryData.surveyId);
      // Get the supplementary data from rootData
      const supplementaryData = questionnaire.supplementaryData; // gives the supplementary data field
      console.log("supplementaryData", supplementaryData.surveyId);

      // const questionnaireSurveyId = questionnaire.surveyId; // gives the data entered into the survey ID field
      // console.log("questionnaireSurveyId", questionnaireSurveyId);

      // console.log("data", data); // gives the data entered into the survey ID field
      // console.log("parentdata", parentData); // the whole questionnaire object

      // If supplementaryData is not available or doesn't contain surveyId, or if surveyId doesn't match, throw an error
      if (
        supplementaryData &&
        supplementaryData.surveyId &&
        data !== supplementaryData.surveyId
      ) {
        // console.log("meow", ERR_SURVEY_ID_MISMATCH);
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
