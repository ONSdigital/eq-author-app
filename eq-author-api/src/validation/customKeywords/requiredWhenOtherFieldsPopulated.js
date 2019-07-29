module.exports = function(ajv) {
  ajv.addKeyword("requiredWhenOtherFieldsPopulated", {
    validate: function isValid(
      otherFields,
      entityData,
      fieldValue,
      dataPath,
      parentData
    ) {
      isValid.errors = [];

      const otherFieldsPopulated = otherFields.filter(field => {
        return parentData[field];
      });

      if (!entityData && otherFieldsPopulated.length) {
        isValid.errors = [
          {
            keyword: "errorMessage",
            dataPath,
            message: "ERR_VALID_REQUIRED",
            params: {},
          },
        ];

        return false;
      }

      return true;
    },
  });
};
