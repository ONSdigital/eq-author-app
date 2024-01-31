const { getOr } = require("lodash/fp");

const {
  DATE,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
  DURATION,
  TEXTAREA,
  TEXTFIELD,
} = require("../constants/answerTypes");

const defaultAnswerPropertiesMap = {
  [CURRENCY]: { required: false, decimals: 0 },
  [NUMBER]: { required: false, decimals: 0 },
  [PERCENTAGE]: { required: false, decimals: 0 },
  [DATE]: { required: false, format: "dd/mm/yyyy" },
  [UNIT]: { required: false, decimals: 0, unit: "" },
  [DURATION]: { required: false, unit: "YearsMonths" },
  [TEXTAREA]: { required: false, maxLength: 2000 },
  [TEXTFIELD]: { required: false, maxLength: 100 },
};

module.exports = (type) =>
  getOr({ required: false }, type, defaultAnswerPropertiesMap);
