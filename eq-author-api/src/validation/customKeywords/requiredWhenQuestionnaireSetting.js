const {
  ERR_REQUIRED_WHEN_SETTING,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

module.exports = function (ajv) {
  ajv.addKeyword("requiredWhenQuestionnaireSetting", {
    validate: function validate(
      settingName,
      value,
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) {
      validate.errors = [];
      const setting = questionnaire[settingName];
      if (!setting) {
        return true;
      }

      if (/\w+/.test(value)) {
        return true;
      }

      const err = createValidationError(
        dataPath,
        fieldName,
        ERR_REQUIRED_WHEN_SETTING,
        questionnaire
      );

      validate.errors.push(err);

      return false;
    },
  });
};
