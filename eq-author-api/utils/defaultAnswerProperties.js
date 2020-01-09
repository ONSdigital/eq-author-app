const { getOr } = require("lodash/fp");

const {
  DATE,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
  DURATION,
  TEXTAREA,
} = require("../constants/answerTypes");

const { CENTIMETRES } = require("../constants/unitTypes");

const defaultAnswerPropertiesMap = {
  [CURRENCY]: { required: false, decimals: 0 },
  [NUMBER]: { required: false, decimals: 0 },
  [PERCENTAGE]: { required: false, decimals: 0 },
  [DATE]: { required: false, format: "dd/mm/yyyy" },
  [UNIT]: { required: false, decimals: 0, unit: CENTIMETRES },
  [DURATION]: { required: false, unit: "YearsMonths" },
  [TEXTAREA]: { required: false, maxLength: "2000" },
};

module.exports = type =>
  getOr({ required: false }, type, defaultAnswerPropertiesMap);
