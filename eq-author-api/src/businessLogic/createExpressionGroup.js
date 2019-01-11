const uuid = require("uuid");
const createExpression = require("./createExpression");

module.exports = input => ({
  id: uuid.v4(),
  operator: "And",
  expressions: [createExpression()],
  ...input,
});
