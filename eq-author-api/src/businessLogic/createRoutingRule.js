const uuid = require("uuid");
const createDestination = require("./createDestination");
const createExpressionGroup = require("./createExpressionGroup");

module.exports = input => ({
  id: uuid.v4(),
  destination: createDestination(),
  expressionGroup: createExpressionGroup(),
  ...input,
});
