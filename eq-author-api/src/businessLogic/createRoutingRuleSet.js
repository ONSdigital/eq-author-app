const uuid = require("uuid");

const createRoutingDestination = require("./createRoutingDestination");
const createRoutingRule = require("./createRoutingRule");
const createRoutingCondition = require("./createRoutingCondition");

module.exports = (questionnaire, pageId) => {
  const elseDestination = createRoutingDestination(questionnaire, pageId);

  const routingRuleSet = {
    id: uuid.v4(),
    else: elseDestination,
    routingRules: [
      createRoutingRule({
        goto: createRoutingDestination(questionnaire, pageId),
        conditions: [createRoutingCondition()],
      }),
    ],
  };

  return routingRuleSet;
};
