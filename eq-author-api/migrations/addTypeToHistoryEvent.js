module.exports = async function addTypeToHistoryEvent(questionnaire) {
  questionnaire.history.map(item => {
    if (!item.type) {
      item.type = item.hasOwnProperty("bodyText") ? "note" : "system";
    }
    return item;
  });

  return questionnaire;
};
