const { v4: uuidv4 } = require("uuid");
const createDestination = require("./createDestination");
const createRoutingRule = require("./createRoutingRule");

module.exports = (input) => ({
  id: uuidv4(),
  else: createDestination(),
  rules: [createRoutingRule()],
  ...input,
});
