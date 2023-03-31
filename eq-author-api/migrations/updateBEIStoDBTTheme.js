module.exports = (questionnaire) => {
  if (questionnaire.theme === "beis") {
    questionnaire.theme = "dbt-dsit";
  }
  if (questionnaire.theme === "beis_ni") {
    questionnaire.theme = "dbt-dsit-ni";
  }
  return questionnaire;
};
