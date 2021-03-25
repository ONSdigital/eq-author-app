// TODO: May be able to re-implement this natively in AJV as part of EAR-1096
// using custom keywords idExists and idPreceedsEntity

const {
  ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const { getPath } = require("../utils");
const { getAbsolutePositionById } = require("../../../schema/resolvers/utils");

module.exports = function (ajv) {
  ajv.addKeyword("validateLeftHandSide", {
    validate: function isValid(
      otherFields,
      entityData,
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) {
      const { sections, folders, pages } = getPath(dataPath);

      const folder = questionnaire.sections[sections].folders[folders];
      const currentPage = pages !== undefined ? folder.pages[pages] : folder;

      isValid.errors =
        entityData && // TODO - use optional chaining syntax when eslint upgraded
        entityData.type === "Answer" &&
        entityData.answerId &&
        getAbsolutePositionById({ questionnaire }, entityData.answerId) >
          getAbsolutePositionById({ questionnaire }, currentPage.id)
          ? [
              createValidationError(
                dataPath,
                fieldName,
                ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
                questionnaire
              ),
            ]
          : [];

      return isValid.errors.length === 0;
    },
  });
};
