module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "requiredWhenIntroductionSetting",
    validate: function validate(
      settingName,
      data,
      _parentSchema,
      { rootData: questionnaire }
    ) {
      return Boolean(data?.length || !questionnaire.introduction[settingName]);
    },
  });
