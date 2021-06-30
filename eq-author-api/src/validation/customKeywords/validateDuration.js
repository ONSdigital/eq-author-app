const {
  ERR_MAX_DURATION_TOO_SMALL,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const durationUnitTypes = {
  days: "Days",
  months: "Months",
  years: "Years",
};

const getNewDate = (duration) => {
  const { unit, value } = duration;
  const { days, months, years } = durationUnitTypes;
  let currentDate = new Date();

  switch (unit) {
    case days:
      return currentDate.setDate(currentDate.getDate() + Number(value));
    case months:
      return currentDate.setMonth(currentDate.getMonth() + Number(value));
    case years:
      return currentDate.setFullYear(currentDate.getFullYear() + Number(value));
    default:
      throw new Error("Incorrect date unit supplied");
  }
};

module.exports = (ajv) =>
  ajv.addKeyword({
    $data: true,
    keyword: "validateDuration",
    validate: function isValid(
      maxDuration,
      minDuration,
      _parentSchema,
      { instancePath, parentDataProperty: fieldName, rootData: questionnaire }
    ) {
      const minDate = getNewDate(minDuration);
      const maxDate = getNewDate(maxDuration);

      if (maxDate < minDate) {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            ERR_MAX_DURATION_TOO_SMALL,
            questionnaire
          ),
        ];
        return false;
      }

      return true;
    },
  });
