const uuid = require("uuid");

module.exports = (input = {}) => ({
  id: uuid.v4(),
  operation: "And",
  ...input,
});
