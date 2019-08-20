const uuid = require("uuid");
const createDestination = require("./createDestination");
const createExpressionGroup = require("./createExpressionGroup");
const { AND } = require("../../constants/routingOperators");

module.exports = input => ({
  id: uuid.v4(),
  destination: createDestination(),
  expressionGroup: createExpressionGroup(),
  operator: AND,
  ...input,
});
