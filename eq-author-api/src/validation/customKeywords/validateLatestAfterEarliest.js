const moment = require("moment");
const { find } = require("lodash");
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
      parentData,
      fieldName,
      questionnaire
    ) {
      isValid.errors = [];

      const getDate = data => {
        let date;
        if (data.metadata) {
          date = find(questionnaire.metadata, { id: data.metadata }).dateValue;
        } else {
          date = data.custom;
        }

        if (data.relativePosition === "Before") {
          return moment(date)
            .subtract(data.offset.value, data.offset.unit)
            .unix();
        }
        return moment(date)
          .add(data.offset.value, data.offset.unit)
          .unix();
      };

      const a = getDate(otherFields);
      const b = getDate(parentData);

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
