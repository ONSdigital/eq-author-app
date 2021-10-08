const { getOrderedIdMap } = require("../../../schema/resolvers/utils/helpers");
const createValidationError = require("../createValidationError");

const { CALCSUM_MOVED } = require("../../../constants/validationErrorCodes");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "calculatedSummaryPosition",
    $data: true,
    validate: function isValid(
      schema,
      data,
      _parentSchema,
      {
        instancePath,
        rootData: questionnaire,
        parentData,
        parentDataProperty: fieldName,
      }
    ) {
      isValid.errors = [];
      const orderedIds = getOrderedIdMap({ questionnaire });
      const { id: calcSumId } = parentData;
      const answerIdsToCalc = data;
      const calcSumPos = orderedIds.get(calcSumId);
      answerIdsToCalc.forEach((id) => {
        const pagePos = orderedIds.get(id);
        if (calcSumPos < pagePos) {
          isValid.errors.push(
            createValidationError(
              instancePath,
              fieldName,
              CALCSUM_MOVED,
              questionnaire
            )
          );
        }
      });

      if (isValid.errors.length) {
        return false;
      }

      return true;
    },
  });
