module.exports = converter => (req, res, next) => {
  converter
    .convert(res.locals.questionnaire)
    .then(questionnaire => {
      res.locals.questionnaire = questionnaire;
      next();
    })
    .catch(err => next(err));
};
