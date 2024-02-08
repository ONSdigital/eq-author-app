const { getAnswers } = require("./answerGetters");

const setDataVersion = ({ questionnaire }) => {
  questionnaire.dataVersionThreeRequired = false;

  if (questionnaire.collectionLists?.lists?.length) {
    questionnaire.dataVersion = "3";
    questionnaire.dataVersionThreeRequired = true;
    return;
  }

  if (questionnaire.supplementaryData) {
    questionnaire.dataVersion = "3";
    questionnaire.dataVersionThreeRequired = true;
    return;
  }

  const allAnswers = getAnswers({ questionnaire });
  allAnswers.some((answer) => {
    return answer.options?.some((option) => {
      if (option.dynamicAnswer) {
        questionnaire.dataVersion = "3";
        questionnaire.dataVersionThreeRequired = true;
        return true;
      }
      return false;
    });
  });
};

module.exports = { setDataVersion };
