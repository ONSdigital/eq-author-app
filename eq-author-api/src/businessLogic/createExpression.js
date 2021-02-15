const { v4: uuidv4 } = require("uuid");
const createLeftSide = require("./createLeftSide");

module.exports = (input) => ({
  id: uuidv4(),
  condition: "Equal",
  left: createLeftSide(),
  ...input,
});
