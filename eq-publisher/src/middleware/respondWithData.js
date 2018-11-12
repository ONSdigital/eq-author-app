module.exports = function respondWithData(req, res) {
  res.json(res.locals.questionnaire);
};
