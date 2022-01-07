const createSubmission = require("../utils/createSubmission");

module.exports = (questionnaire) => {
  if (
    questionnaire.submission === undefined ||
    questionnaire.submission === null
  ) {
    questionnaire.submission = createSubmission();
  }

  return questionnaire;
};
