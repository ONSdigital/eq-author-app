const {
  ERR_DESTINATION_MOVED,
} = require("../../../constants/validationErrorCodes");

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
    validate: function isValid(otherFields, entityData, dataPath) {
      isValid.errors = [];
      const allSections = otherFields;

      const splitDataPath = dataPath.split("/");

      const currentSectionIndex = splitDataPath[2];
      const currentPageIndex = splitDataPath[4];

      const destinationId = entityData.pageId || entityData.sectionId;
      let destinationSectionIndex, destinationPageIndex;

      for (const [i, { pages, id: sectionId }] of allSections.entries()) {
        if (entityData.sectionId && destinationId === sectionId) {
          destinationSectionIndex = i;
          destinationPageIndex = 0;
        }
        if (entityData.pageId) {
          for (const [j, page] of pages.entries()) {
            if (destinationId === page.id) {
              destinationSectionIndex = i;
              destinationPageIndex = j;
            }
          }
        }
      }

      if (
        destinationSectionIndex < currentSectionIndex ||
        (destinationSectionIndex > currentSectionIndex &&
          destinationPageIndex > 0)
      ) {
        isValid.errors.push(
          newValidationError("errorMessage", dataPath, ERR_DESTINATION_MOVED)
        );
        return false;
      }

      return true;
    },
  });
};
