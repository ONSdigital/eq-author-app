const { getExpressions } = require("../schema/resolvers/utils");

module.exports = (questionnaire) => {
  getExpressions({ questionnaire }).forEach((expression) => {
    delete expression.left.id;
    delete expression.left.__typename;
    delete expression.left.options;
  });

  return questionnaire;
};
