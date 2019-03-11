const { performance } = require("perf_hooks");
const validateQuestionnaire = require("../src/validation");

module.exports = logger => (req, res, next) => {
  if (!req.questionnaire) {
    return next();
  }

  const before = performance.now();
  req.validationErrors = validateQuestionnaire(req.questionnaire);
  const after = performance.now();
  logger.info("Validation took %dms", after - before);

  return next();
};
