module.exports = (questionnaire) => {
  if (questionnaire.theme === "health") {
    questionnaire.theme = "ukhsa-ons";
  }
  return questionnaire;
};
