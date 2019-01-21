const getNextDestination = require("./getNextDestination");
const {
  END_OF_QUESTIONNAIRE,
  NEXT_PAGE,
} = require("../../constants/logicalDestinations");

module.exports = (questionnaire, pageId) => {
  const { result } = getNextDestination(questionnaire, pageId);
  const destination = {};
  if (result === END_OF_QUESTIONNAIRE) {
    destination.logicalDestination = END_OF_QUESTIONNAIRE;
  } else {
    destination.logicalDestination = NEXT_PAGE;
  }
  return destination;
};
