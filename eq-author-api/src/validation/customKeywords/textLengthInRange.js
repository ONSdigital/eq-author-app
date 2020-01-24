const {
  ERR_MAX_LENGTH_TOO_LARGE,
  ERR_MAX_LENGTH_TOO_SMALL,
} = require("../../../constants/validationErrorCodes");

module.exports = function(ajv) {
  ajv.addKeyword("textLengthInRange", {
    validate: function isValid(otherFields, entityData, fieldValue, dataPath) {
      isValid.errors = [];
      const dataPathArr = dataPath.split("/");
      if (entityData > 2000) {
        isValid.errors = [
          {
            keyword: "errorMessage",
            dataPath: dataPathArr.slice(0, 8).join("/"),
            message: ERR_MAX_LENGTH_TOO_LARGE,
            params: {},
          },
        ];

        return false;
      }

      if (entityData < 10) {
        isValid.errors = [
          {
            keyword: "errorMessage",
            dataPath: dataPathArr.slice(0, 8).join("/"),
            message: ERR_MAX_LENGTH_TOO_SMALL,
            params: {},
          },
        ];

        return false;
      }

      return true;
    },
  });
};
