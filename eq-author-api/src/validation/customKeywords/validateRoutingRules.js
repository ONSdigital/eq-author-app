const {
  ERR_DESTINATION_DELETED,
  ERR_DESTINATION_MOVED,
} = require("../../../constants/validationErrorCodes");

const {
  getAbsolutePositionById,
} = require("../../../schema/resolvers/utils/utils");

const createValidationError = require("../createValidationError");
const { getPath } = require("../utils");

module.exports = function (ajv) {
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
      const { sections: sectionsIndex, folders, pages } = getPath(dataPath);
      const currentPageId =
        questionnaire.sections[sectionsIndex].folders[folders].pages[pages].id;
      const { pageId, sectionId, logical } = entityData.destination;

      if (!pageId && !sectionId && !logical) {
        const err = createValidationError(
          dataPath,
          "destination",
          ERR_DESTINATION_DELETED,
          questionnaire
        );
        isValid.errors.push(err);

        return false;
      }

      const pagePosition = getAbsolutePositionById(
        { questionnaire },
        currentPageId
      );

      if (
        (pageId &&
          getAbsolutePositionById({ questionnaire }, pageId) < pagePosition) ||
        (sectionId &&
          getAbsolutePositionById({ questionnaire }, sectionId) < pagePosition)
      ) {
        const err = createValidationError(
          dataPath,
          "destination",
          ERR_DESTINATION_MOVED,
          questionnaire
        );
        isValid.errors.push(err);

        return false;
      }

      return true;
    },
  });
};
