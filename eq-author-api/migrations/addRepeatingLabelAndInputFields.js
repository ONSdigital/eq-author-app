const {
  TEXTFIELD,
  TEXTAREA,
  DURATION,
  UNIT,
  CURRENCY,
  PERCENTAGE,
  NUMBER,
  DATE,
} = require("../constants/answerTypes");

module.exports = (questionnaire) => {
  questionnaire?.sections?.forEach((section) => {
    section?.folders?.forEach((folder) => {
      folder?.pages?.forEach((page) => {
        page?.answers?.forEach((answer) => {
          if (
            [
              TEXTFIELD,
              TEXTAREA,
              DURATION,
              UNIT,
              CURRENCY,
              PERCENTAGE,
              NUMBER,
              DATE,
            ].includes(answer.type) &&
            !("repeatingLabelAndInput" in answer)
          ) {
            answer.repeatingLabelAndInput = false;
            answer.repeatingLabelAndInputListId = "";
          }
        });
      });
    });
  });

  return questionnaire;
};
