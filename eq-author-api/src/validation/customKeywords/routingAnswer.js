const {
  ERR_ANSWER_NOT_SELECTED,
} = require("../../../constants/validationErrorCodes");

// not sure if this gonna cause problems
const errorTypes = {
  isNull: "Null",
};

module.exports = function(ajv) {
  ajv.addKeyword("routingAnswer", {
    $data: true,
    validate: function isValid(otherFields, entityData, fieldValue, dataPath) {
      const { type } = entityData;
      isValid.errors = [];

      const valid = type !== errorTypes.isNull;

      if (!valid) {
        isValid.errors = [
          {
            keyword: "errorMessage",
            dataPath,
            message: ERR_ANSWER_NOT_SELECTED,
            params: {},
          },
        ];

        return false;
      }

      return true;
    },
  });
};
