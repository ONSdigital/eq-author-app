module.exports = (ajv) => {
  require("./requiredWhenQuestionnaireSetting")(ajv);
  require("./uniquePropertyValueInArrayOfObjects")(ajv);
  require("./calculatedSummaryUnitConsistency")(ajv);
  require("./calculatedSummaryPosition")(ajv);
  require("./validateLatestAfterEarliest")(ajv);
  require("./validateDuration")(ajv);
  require("./validateMultipleChoiceCondition")(ajv);
  require("./validateExpression")(ajv);
  require("./validateRoutingDestination")(ajv);
  require("./validateRoutingLogicalAND")(ajv);
  require("./validatePipingAnswerInTitle")(ajv);
  require("./validatePipingMetadataInTitle")(ajv);
  require("./idExists")(ajv);
  require("./idPreceedsCurrentEntity")(ajv);
  require("./requiredWhenSectionSetting")(ajv);
  require("./validateSecondaryCondition")(ajv);
};
