const { getExpressions } = require("../schema/resolvers/utils");

module.exports = (questionnaire) => {
  getExpressions({ questionnaire }).forEach((expression) => {
    if (expression.left?.id) {
      delete expression.left.id;
    }
    if (expression.left?.__typename) {
      delete expression.left.__typename;
    }
    if (expression.left?.options) {
      delete expression.left.options;
    }
    if (expression.right?.options) {
      delete expression.right.options;
    }
  });

  return questionnaire;
};
