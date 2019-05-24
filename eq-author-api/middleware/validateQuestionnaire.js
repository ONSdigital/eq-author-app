const validateQuestionnaire = require("../src/validation");

module.exports = async (req, res, next) => {
  if (!req.questionnaire) {
    return next();
  }
  req.validationErrorInfo = await validateQuestionnaire(req.questionnaire);
  next();
};
