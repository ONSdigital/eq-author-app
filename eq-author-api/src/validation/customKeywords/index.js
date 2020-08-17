module.exports = ajv => {
  require("./uniquePropertyValueInArrayOfObjects")(ajv);
  require("./requiredWhenQuestionnaireSetting")(ajv);
  require("./requiredWhenOtherFieldsPopulated")(ajv);
  require("./calculatedSummaryUnitConsistency")(ajv);
  require("./linkedDecimalValidation")(ajv);
  require("./validateLatestAfterEarliest")(ajv);
  require("./validateDuration")(ajv);
  require("./textLengthInRange")(ajv);
  require("./validateExclusiveCheckbox")(ajv);
  require("./validateLeftHandSide")(ajv);
  require("./validateRoutingRules")(ajv);
  require("./validatePipingInTitle")(ajv);
};
