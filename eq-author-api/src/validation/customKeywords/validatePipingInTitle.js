const {
  DELETED_PIPING_TITLE,
} = require("../../../constants/validationErrorCodes");

const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");

module.exports = function(ajv) {
  ajv.addKeyword("validatePipingInTitle", {
    $data: true,
    validate: function isValid(
      otherFields,
      entityData,
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) {
      isValid.errors = [];

      console.log("\n\ndataPath", dataPath);
      console.log("\n\nentityData", entityData);

      const splitDataPath = dataPath.split("/");
      const currentPage =
        questionnaire.sections[splitDataPath[2]].pages[splitDataPath[4]];
      console.log("\n\ncurrentPage", currentPage);

      //availablePipingAnswers
      const previousAnswersForPage = getPreviousAnswersForPage(
        questionnaire,
        currentPage.id,
        true
        // ROUTING_ANSWER_TYPES
      );
      console.log("\n\npreviousAnswersForPage", previousAnswersForPage);

      //!hasAvailablePipingAnswers || includes ""Deleted answer""

      if (entityData.includes("Deleted answer")) {
        console.log("\n\nyaaaay!!!");
        isValid.errors = [
          {
            keyword: "errorMessage",
            dataPath,
            message: DELETED_PIPING_TITLE,
            params: {},
          },
        ];
        return false;
      }
      return true;
    },
  });
};
