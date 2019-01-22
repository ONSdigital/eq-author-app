const uuid = require("uuid");
const createExpression = require("./createExpresion");

module.exports = input => ({
  id: uuid.v4(),
  operator: "And",
  expressions: [createExpression()],
  ...input,
});
