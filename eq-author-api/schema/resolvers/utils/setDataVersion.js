const { getAnswers } = require("./answerGetters");
const allDataVersions = require("../../../constants/allDataVersions");

const setDataVersion = ({ questionnaire }) => {
  questionnaire.allowableDataVersions = allDataVersions;

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
