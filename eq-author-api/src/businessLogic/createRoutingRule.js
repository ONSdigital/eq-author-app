const { v4: uuidv4 } = require("uuid");
const createDestination = require("./createDestination");
const createExpressionGroup = require("./createExpressionGroup");

module.exports = (input) => ({
  id: uuidv4(),
  destination: createDestination(),
  expressionGroup: createExpressionGroup(),
  ...input,
});
