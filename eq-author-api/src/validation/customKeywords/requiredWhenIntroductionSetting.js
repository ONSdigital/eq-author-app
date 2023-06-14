module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "requiredWhenIntroductionSetting",
    validate: function validate(
      settingName,
      data,
      _parentSchema,
      { rootData: questionnaire }
    ) {
      if (questionnaire.introduction) {
        return Boolean(
          data?.length || !questionnaire.introduction[settingName]
        );
      } else {
        return true;
      }
    },
  });
