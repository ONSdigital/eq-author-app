const { getAnswers } = require("../schema/resolvers/utils");
const { CHECKBOX, RADIO } = require("../constants/answerTypes");
const { filter } = require("lodash");

module.exports = (questionnaire) => {
  const ctx = {
    questionnaire,
  };
  const answers = getAnswers(ctx);

  answers.map((answer) => {
    if (![CHECKBOX, RADIO].includes(answer.type)) {
      if (answer?.options?.length > 0) {
        answer.advancedProperties = true;
      }
      if (answer?.properties?.fallback?.enabled) {
        answer.advancedProperties = true;
      }
      if (filter(answer?.validation, { enabled: true }).length > 0) {
        answer.advancedProperties = true;
      }
    }
  });

  return questionnaire;
};
