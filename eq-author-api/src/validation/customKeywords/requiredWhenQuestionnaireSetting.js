module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "requiredWhenQuestionnaireSetting",
    validate: function validate(
      settingName,
      data,
      _parentSchema,
      { rootData: questionnaire }
    ) {
      return Boolean(data?.length || !questionnaire[settingName]);
    },
  });
