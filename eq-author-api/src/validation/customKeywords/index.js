module.exports = ajv => {
  require("./uniquePropertyValueInArrayOfObjects")(ajv);
  require("./requiredWhenQuestionnaireSetting")(ajv);
};
