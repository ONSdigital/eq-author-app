module.exports = (questionnaire) => {
  if (questionnaire.theme === "beis") {
    questionnaire.theme = "dbt_dsit";
  }
  if (questionnaire.theme === "beis_ni") {
    questionnaire.theme = "dbt_dsit_ni";
  }
  return questionnaire;
};
