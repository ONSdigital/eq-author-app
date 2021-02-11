const { v4: uuidv4 } = require("uuid");

module.exports = (input) => ({
  id: uuidv4(),
  ...input,
});
