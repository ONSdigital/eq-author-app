const {
  ERR_EARLIEST_AFTER_LATEST,
} = require("../../../constants/validationErrorCodes");

module.exports = function(ajv) {
  ajv.addKeyword("validateDuration", {
    $data: true,
    validate: function isValid(otherFields, entityData, fieldValue, dataPath) {
      isValid.errors = [];

      const valid = true;

      if (!valid) {
        isValid.errors = [
          {
            keyword: "errorMessage",
            dataPath,
            message: ERR_EARLIEST_AFTER_LATEST,
            params: {},
          },
        ];

        return false;
      }

      return true;
    },
  });
};
