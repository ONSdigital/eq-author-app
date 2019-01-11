const uuid = require("uuid");
const createDestination = require("./createDestination");
const createRoutingRule = require("./createRoutingRule");

module.exports = input => ({
  id: uuid.v4(),
  else: createDestination(),
  rules: [createRoutingRule()],
  ...input,
});
