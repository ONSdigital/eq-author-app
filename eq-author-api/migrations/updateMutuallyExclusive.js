const { getAnswers } = require("../schema/resolvers/utils");
const { MUTUALLY_EXCLUSIVE } = require("../constants/answerTypes");

module.exports = (questionnaire) => {
  const ctx = {
    questionnaire,
  };
  const answers = getAnswers(ctx);

  answers.map((answer) => {
    if (answer.type === MUTUALLY_EXCLUSIVE) {
      if (answer.options[0].qcode) {
        if (answer.qcode === undefined || answer.qcode === null) {
          answer.qcode = answer.options[0].qcode.value;
        }
        delete answer.options[0].qcode;
      }
    }
  });

  return questionnaire;
};
