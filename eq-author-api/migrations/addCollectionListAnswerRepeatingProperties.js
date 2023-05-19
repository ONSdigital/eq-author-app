module.exports = (questionnaire) => {
  questionnaire.collectionLists.lists.forEach((list) => {
    list.answers.forEach((answer) => {
      if (
        answer.repeatingLabelAndInput === null ||
        answer.repeatingLabelAndInput === undefined
      ) {
        answer.repeatingLabelAndInput = false;
      }
      if (
        answer.repeatingLabelAndInputListId === null ||
        answer.repeatingLabelAndInputListId === undefined
      ) {
        answer.repeatingLabelAndInputListId = "";
      }
    });
  });

  return questionnaire;
};
