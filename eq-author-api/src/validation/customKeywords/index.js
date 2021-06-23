module.exports = (ajv) => {
  require("./requiredWhenQuestionnaireSetting")(ajv); // done
  require("./uniquePropertyValueInArrayOfObjects")(ajv); // done
  require("./calculatedSummaryUnitConsistency")(ajv); // done
  require("./linkedDecimalValidation")(ajv); // done
  require("./validateLatestAfterEarliest")(ajv); // done
  require("./validateDuration")(ajv); // done
  require("./validateMultipleChoiceCondition")(ajv); // done
  require("./validateExpression")(ajv); // done ( for now )
  require("./validateRoutingDestination")(ajv); // done
  require("./validateRoutingLogicalAND")(ajv); // done
  require("./validatePipingInTitle")(ajv); // done
  require("./idExists")(ajv); // done
  require("./idPreceedsCurrentEntity")(ajv); // done
};
