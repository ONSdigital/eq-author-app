module.exports = function(ajv) {
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
      const setting = questionnaire[settingName];
      if (!setting) {
        return true;
      }

      if (/\w+/.test(value)) {
        return true;
      }

      validate.errors = [
        {
          keyword: "errorMessage",
          dataPath,
          message: "ERR_REQUIRED_WHEN_SETTING",
          params: {},
        },
      ];

      return false;
    },
  });
};
