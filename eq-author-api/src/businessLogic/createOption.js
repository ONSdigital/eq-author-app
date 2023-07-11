const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash/fp");
const { logger } = require("../../utils/logger");
const createAdditionalAnswer = require("./createAdditionalAnswer");

module.exports = (input = {}) => {
  let additionalAnswer;
  if (input.hasAdditionalAnswer) {
    additionalAnswer = createAdditionalAnswer();
    logger.info(
      `Additional Answer created with ${JSON.stringify(additionalAnswer)}`
    );
  }

  return {
    id: uuidv4(),
    label: "",
    qCode: "",
    ...omit(["answerId", "hasAdditionalAnswer"], input),
    optionValue: "",
    additionalAnswer,
  };
};
