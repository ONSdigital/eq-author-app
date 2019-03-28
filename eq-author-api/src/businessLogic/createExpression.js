const uuid = require("uuid");
const createLeftSide = require("./createLeftSide");

module.exports = input => ({
  id: uuid.v4(),
  condition: "Equal",
  left: createLeftSide(),
  ...input,
});
