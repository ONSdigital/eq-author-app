const uuid = require("uuid");

module.exports = input => ({
  id: uuid.v4(),
  ...input,
});
