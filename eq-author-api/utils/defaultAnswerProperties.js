const {
  DATE,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
} = require("../constants/answerTypes");

module.exports = type => {
  switch (type) {
    case CURRENCY:
    case NUMBER:
    case PERCENTAGE:
      return { required: false, decimals: 0 };
    case DATE:
      return { required: false, format: "dd/mm/yyyy" };
    default:
      return { required: false };
  }
};
