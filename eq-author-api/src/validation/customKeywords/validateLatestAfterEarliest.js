const moment = require("moment");
const {
  ERR_EARLIEST_AFTER_LATEST,
} = require("../../../constants/validationErrorCodes");

module.exports = function(ajv) {
  ajv.addKeyword("validateLatestAfterEarliest", {
    $data: true,
    validate: function isValid(
      otherFields,
      entityData,
      fieldValue,
      dataPath,
      parentData
    ) {
      isValid.errors = [];

      const translationMatrix = {
        Before: data =>
          moment(data.custom)
            .subtract(data.offset.value, data.offset.unit)
            .unix(),
        After: data =>
          moment(data.custom)
            .add(data.offset.value, data.offset.unit)
            .unix(),
      };

      const a = translationMatrix[otherFields.relativePosition](otherFields);
      const b = translationMatrix[parentData.relativePosition](parentData);

      const isLatest = dataPath.split("/").includes("latestDate");

      const valid = isLatest ? a < b : a > b;

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
