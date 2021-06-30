const moment = require("moment");
const { find } = require("lodash");
const {
  ERR_EARLIEST_AFTER_LATEST,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const getDate = (
  {
    entityType,
    metadata,
    relativePosition,
    offset: { value, unit } = {},
    custom,
  },
  questionnaire
) => {
  const date = moment(
    entityType === "Now"
      ? new Date()
      : find(questionnaire.metadata, { id: metadata })?.dateValue ?? custom
  );

  return date[relativePosition === "Before" ? "subtract" : "add"](
    value,
    unit
  ).unix();
};

module.exports = (ajv) =>
  ajv.addKeyword({
    $data: true,
    keyword: "validateLatestAfterEarliest",
    validate: function isValid(
      latestDateVal,
      earliestDateVal,
      _parentSchema,
      { rootData: questionnaire, parentDataProperty: fieldName, instancePath }
    ) {
      if (
        getDate(earliestDateVal, questionnaire) >
        getDate(latestDateVal, questionnaire)
      ) {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            ERR_EARLIEST_AFTER_LATEST,
            questionnaire
          ),
        ];
        return false;
      }

      return true;
    },
  });
