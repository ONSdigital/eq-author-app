const { uniq } = require("lodash/fp");

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

  page.totalValidation = createTotalValidation();
};

module.exports = (page, answer) => {
  createOrRemoveAnswerGroup(page, answer);
};
