const {
  ERR_PAGE_MOVED,
  ERR_PAGE_DELETED,
  ERR_SECTION_MOVED,
  ERR_SECTION_DELETED,
} = require("../../../constants/validationErrorCodes");
const availableRoutingDestinatinons = require("../../businessLogic/availableRoutingDestinations");
const {
  getPageById,
  getSectionById,
} = require("../../../schema/resolvers/utils");
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
        entityData.destination.pageId &&
        !getPageById({ questionnaire }, entityData.destination.pageId)
      ) {
        isValid.errors.push(
          newValidationError(
            "errorMessage",
            `${dataPath}/destination`,
            ERR_PAGE_DELETED
          )
        );
        return false;
      }
      if (
        entityData.destination.pageId &&
        !some(questionPages, { id: entityData.destination.pageId })
      ) {
        isValid.errors.push(
          newValidationError(
            "errorMessage",
            `${dataPath}/destination`,
            ERR_PAGE_MOVED
          )
        );
        return false;
      }
      if (
        entityData.destination.sectionId &&
        !getSectionById({ questionnaire }, entityData.destination.sectionId)
      ) {
        isValid.errors.push(
          newValidationError(
            "errorMessage",
            `${dataPath}/destination`,
            ERR_SECTION_DELETED
          )
        );
        return false;
      }
      if (
        entityData.destination.sectionId &&
        !some(sections, { id: entityData.destination.sectionId })
      ) {
        isValid.errors.push(
          newValidationError(
            "errorMessage",
            `${dataPath}/destination`,
            ERR_SECTION_MOVED
          )
        );
        return false;
      }
      return true;
    },
  });
};
