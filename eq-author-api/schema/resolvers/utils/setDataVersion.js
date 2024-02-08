const { getAnswers } = require("./answerGetters");

const setDataVersion = ({ questionnaire }) => {
  questionnaire.allowableDataVersions = ["1", "3"];

  if (questionnaire.collectionLists?.lists?.length) {
    questionnaire.dataVersion = "3";
    questionnaire.allowableDataVersions = ["3"];
    return;
  }

  if (questionnaire.supplementaryData) {
    questionnaire.dataVersion = "3";
    questionnaire.allowableDataVersions = ["3"];
    return;
  }

  const allAnswers = getAnswers({ questionnaire });
  allAnswers.some((answer) => {
    return answer.options?.some((option) => {
      if (option.dynamicAnswer) {
        questionnaire.dataVersion = "3";
        questionnaire.allowableDataVersions = ["3"];
        return true;
      }
      return false;
    });
  });
};

module.exports = { setDataVersion };
