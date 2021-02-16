//This is an auto-generated file.  Do NOT modify the method signature.
const AND = "And";

module.exports = function addExpressionOperator(questionnaire) {
  questionnaire.sections.map((section) => {
    section.pages.map((page) => {
      if (page.routing) {
        page.routing.rules.map((rule) => {
          if (!rule.expressionGroup.operator) {
            rule.expressionGroup.operator = AND;
          }
        });
      }
    });
  });
  return questionnaire;
};
