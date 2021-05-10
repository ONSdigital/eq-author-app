module.exports = function addTypeToHistoryEvent(questionnaire) {
  questionnaire.history.map((item) => {
    if (!item.type) {
      item.type = Object.prototype.hasOwnProperty.call(item, "bodyText")
        ? "note"
        : "system";
    }
    return item;
  });

  return questionnaire;
};
