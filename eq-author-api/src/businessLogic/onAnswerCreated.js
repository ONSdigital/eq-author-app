const { uniq } = require("lodash/fp");
const { logger } = require("../../utils/logger");

const totalableAnswerTypes = require("../../constants/totalableAnswerTypes");

const createTotalValidation = require("./createTotalValidation");

const createOrRemoveAnswerGroup = (page, newAnswer) => {
  const answerTypes = uniq(page.answers.map((a) => a.type));
  if (answerTypes.length > 1) {
    page.totalValidation = null;
    return;
  }

  if (!totalableAnswerTypes.includes(newAnswer.type)) {
    return;
  }

  const numberOfAnswersOfType = page.answers.filter(
    (answer) => answer.type === newAnswer.type
  ).length;
  if (numberOfAnswersOfType !== 2) {
    return;
  }

  logger.info(`Answer Created  Answer Types ${JSON.stringify(answerTypes)}`);

  page.totalValidation = createTotalValidation();

  logger.info(`Answer Created  validation ${JSON.stringify(page.validation)}`);
};

module.exports = (page, answer) => {
  createOrRemoveAnswerGroup(page, answer);
};
