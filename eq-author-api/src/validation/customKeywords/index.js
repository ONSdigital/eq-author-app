module.exports = (ajv) => {
  require("./requiredWhenQuestionnaireSetting")(ajv);
  require("./uniquePropertyValueInArrayOfObjects")(ajv);
  require("./calculatedSummaryUnitConsistency")(ajv);
  require("./linkedDecimalValidation")(ajv);
  require("./validateLatestAfterEarliest")(ajv);
  require("./validateDuration")(ajv);
  require("./validateMultipleChoiceCondition")(ajv);
  require("./validateExpression")(ajv);
  require("./validateRoutingDestination")(ajv);
  require("./validateRoutingLogicalAND")(ajv);
  require("./validatePipingInTitle")(ajv);
  require("./idExists")(ajv);
  require("./idPreceedsCurrentEntity")(ajv);
};
