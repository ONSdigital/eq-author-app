const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash/fp");
const createAdditionalAnswer = require("./createAdditionalAnswer");

module.exports = (input = {}) => {
  let additionalAnswer;
  if (input.hasAdditionalAnswer) {
    additionalAnswer = createAdditionalAnswer();
  }

  return {
    id: uuidv4(),
    label: "",
    qCode: "",
    ...omit(["answerId", "hasAdditionalAnswer"], input),
    additionalAnswer,
  };
};
