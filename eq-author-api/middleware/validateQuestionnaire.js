const validateQuestionnaire = require("../src/validation");

module.exports = (req, res, next) => {
  if (!req.questionnaire) {
    next();
    return;
  }

  req.validationErrorInfo = validateQuestionnaire(req.questionnaire);
  next();
};
