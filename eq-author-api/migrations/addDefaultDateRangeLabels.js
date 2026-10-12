const { DATE_RANGE } = require("../constants/answerTypes");

module.exports = (questionnaire) => {
  questionnaire?.sections?.forEach((section) => {
    section?.folders?.forEach((folder) => {
      folder?.pages?.forEach((page) => {
        page?.answers?.forEach((answer) => {
          if (answer.type === DATE_RANGE) {
            if (answer.label === null || answer.label === undefined) {
              answer.label = "";
            }

            if (
              answer.secondaryLabel === null ||
              answer.secondaryLabel === undefined
            ) {
              answer.secondaryLabel = "";
            }
          }
        });
      });
    });
  });

  return questionnaire;
};
