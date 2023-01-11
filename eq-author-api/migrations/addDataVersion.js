module.exports = (questionnaire) => {
  if (questionnaire.collectionLists.lists.length > 0) {
    questionnaire.dataVersion = "3";
  } else {
    questionnaire.dataVersion = "1";
  }

  return questionnaire;
};
