module.exports = function respondWithData(req, res) {
  var questionnaire = res.locals.questionnaire;
  var trimmedQuestionnaire = JSON.parse(
    JSON.stringify(questionnaire).replace(/"\s+|\s+"/g, '"')
  );

  res.json(trimmedQuestionnaire);
};
