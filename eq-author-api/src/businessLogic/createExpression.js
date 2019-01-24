const uuid = require("uuid");
const createLeftSide = require("./createLeftSide");
const createRightSide = require("./createRightSide");

module.exports = input => ({
  id: uuid.v4(),
  condition: "Equal",
  left: createLeftSide(),
  right: createRightSide(),
  ...input,
});
