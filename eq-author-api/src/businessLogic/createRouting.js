const uuid = require("uuid");
const createDestination = require("./createDestination");

const createLeftSide = input => ({
  type: "Answer",
  answerId: "",
  nullReason: "",
  ...input,
});

const createRightSide = input => ({
  type: "SelectedOptions",
  customValue: "",
  optionIds: [],
  ...input,
});

const createExpression = input => ({
  id: uuid.v4(),
  condition: "Equal",
  left: createLeftSide(),
  right: createRightSide(),
  ...input,
});

const createExpressionGroup = input => ({
  id: uuid.v4(),
  operator: "And",
  expressions: [createExpression()],
  ...input,
});

const createRoutingRule = input => ({
  id: uuid.v4(),
  destination: createDestination(),
  expressionGroup: createExpressionGroup(),
  ...input,
});

module.exports = input => ({
  id: uuid.v4(),
  else: createDestination(),
  rules: [createRoutingRule()],
  ...input,
});
