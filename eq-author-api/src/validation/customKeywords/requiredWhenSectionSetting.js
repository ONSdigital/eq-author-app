module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "requiredWhenSectionSetting",
    validate: function validate(
      settingName,
      data,
      _parentSchema,
      { parentData }
    ) {
      return Boolean(data?.length || !parentData[settingName]);
    },
  });
