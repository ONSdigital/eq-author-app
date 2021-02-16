const {
  ERR_DESTINATION_DELETED,
  ERR_DESTINATION_MOVED,
} = require("../../../constants/validationErrorCodes");
const availableRoutingDestinations = require("../../businessLogic/availableRoutingDestinations");
const { some } = require("lodash");

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
      const { sections, questionPages } = availableRoutingDestinations(
        questionnaire,
        currentPageId
      );

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

      if (
        (pageId && !some(questionPages, { id: pageId })) ||
        (sectionId && !some(sections, { id: sectionId }))
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
