const {
  ERR_DESTINATION_DELETED,
  ERR_DESTINATION_MOVED,
  ERR_DESTINATION_REQUIRED,
} = require("../../../constants/validationErrorCodes");

const {
  getAbsolutePositionById,
  idExists,
} = require("../../../schema/resolvers/utils");

const createValidationError = require("../createValidationError");

module.exports = function (ajv) {
  ajv.addKeyword("validateRoutingDestination", {
    validate: function isValid(
      _otherFields,
      { id: routingRuleId, pageId, sectionId, logical },
      _fieldValue,
      dataPath,
      _parentData,
      _fieldName,
      questionnaire
    ) {
      isValid.errors = [];
      const targetId = pageId || sectionId;

      const hasError = (error) => {
        isValid.errors.push(
          createValidationError(dataPath, "destination", error, questionnaire)
        );
        return false;
      };

      // Destination required if no logical destination & no target id
      if (logical) {
        return true;
      } else if (!targetId) {
        return hasError(ERR_DESTINATION_REQUIRED);
      }

      // Validate destination exists
      if (!idExists({ questionnaire }, targetId)) {
        return hasError(ERR_DESTINATION_DELETED);
      }

      // Validate ordering: destination must come after page with routing rule
      const pagePosition = getAbsolutePositionById(
        { questionnaire },
        routingRuleId
      );

      if (getAbsolutePositionById({ questionnaire }, targetId) < pagePosition) {
        return hasError(ERR_DESTINATION_MOVED);
      }

      return true;
    },
  });
};
