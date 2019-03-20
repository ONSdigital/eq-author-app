const uuid = require("uuid");
const { omit } = require("lodash/fp");
const createAdditionalAnswer = require("./createAdditionalAnswer");

module.exports = (input = {}) => {
  let additionalAnswer;
  if (input.hasAdditionalAnswer) {
    additionalAnswer = createAdditionalAnswer();
  }

  return {
    id: uuid.v4(),
    ...omit(["answerId", "hasAdditionalAnswer"], input),
    additionalAnswer,
  };
};
