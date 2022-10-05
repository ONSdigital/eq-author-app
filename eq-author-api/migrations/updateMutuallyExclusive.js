const { getAnswers } = require("../schema/resolvers/utils");

module.exports = (questionnaire) => {
  const ctx = {
    questionnaire,
  };
  const answers = getAnswers(ctx);

  answers.map((answer) => {
    if (answer.type === "MutuallyExclusive") {
      if (answer.options !== undefined && answer.options !== null) {
        answer.options.forEach((option) => {
          if (option.qCode) {
            if (!answer.qCode) {
              answer.qCode = option.qCode;
            }
            option.qCode = null;
          }
        });
      }
    }
  });

  return questionnaire;
};
