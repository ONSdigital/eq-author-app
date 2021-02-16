const {
  ERR_MAX_DURATION_TOO_SMALL,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

module.exports = function (ajv) {
  ajv.addKeyword("validateDuration", {
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

      const durationUnitTypes = {
        days: "Days",
        months: "Months",
        years: "Years",
      };

      const getNewDate = (duration) => {
        const { unit, value } = duration;
        const { days, months, years } = durationUnitTypes;

        let currentDate = new Date();

        if (unit === days) {
          currentDate.setDate(currentDate.getDate() + +Number(value));
          return currentDate;
        } else if (unit === months) {
          currentDate.setMonth(currentDate.getMonth() + +Number(value));
          return currentDate;
        } else if (unit === years) {
          currentDate.setFullYear(currentDate.getFullYear() + +Number(value));
          return currentDate;
        } else {
          throw new Error("Incorrect date unit supplied");
        }
      };

      const firstDate = getNewDate(otherFields.duration);
      const secondDate = getNewDate(entityData);

      const min = dataPath.includes("/minDuration");

      const valid = min ? firstDate > secondDate : secondDate > firstDate;

      if (!valid) {
        const err = createValidationError(
          dataPath,
          fieldName,
          ERR_MAX_DURATION_TOO_SMALL,
          questionnaire
        );
        isValid.errors.push(err);

        return false;
      }

      return true;
    },
  });
};
