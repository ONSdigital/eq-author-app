const {
  ERR_DESTINATION_DELETED,
  ERR_DESTINATION_MOVED,
} = require("../../../constants/validationErrorCodes");
const availableRoutingDestinatinons = require("../../businessLogic/availableRoutingDestinations");
const { some } = require("lodash");
const newValidationError = (
  keyword = "errorMessage",
  dataPath = [],
  message = null,
  params = {}
) => ({
  keyword,
  dataPath,
  message,
  params,
});
module.exports = function(ajv) {
  ajv.addKeyword("validateRoutingRule", {
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
      const splitDataPath = dataPath.split("/");
      const currentPageId =
        questionnaire.sections[splitDataPath[2]].pages[splitDataPath[4]].id;
      const { sections, questionPages } = availableRoutingDestinatinons(
        questionnaire,
        currentPageId
      );

      if (
        !entityData.destination.pageId &&
        !entityData.destination.sectionId &&
        !entityData.destination.logical
      ) {
        isValid.errors.push(
          newValidationError(
            "errorMessage",
            `${dataPath}/destination`,
            ERR_DESTINATION_DELETED
          )
        );
        return false;
      }

      if (
        (entityData.destination.pageId &&
          !some(questionPages, { id: entityData.destination.pageId })) ||
        (entityData.destination.sectionId &&
          !some(sections, { id: entityData.destination.sectionId }))
      ) {
        isValid.errors.push(
          newValidationError(
            "errorMessage",
            `${dataPath}/destination`,
            ERR_DESTINATION_MOVED
          )
        );
        return false;
      }

      return true;
    },
  });
};
