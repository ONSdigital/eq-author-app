const { keys, first } = require("lodash/fp");

const RoutingDestination = require("./RoutingDestination");
const RoutingConditions = require("./RoutingConditions");

class RoutingRule {
  constructor(rule, pageId, groupId, ctx) {
    this.goto = {
      ...this.buildRoutingDestination(rule.goto, pageId, ctx),
      ...this.buildRoutingConditions(rule.conditions)
    };

    this.addRuleToContext(this.goto, groupId, ctx);
  }

  addRuleToContext(goto, groupId, ctx) {
    const destinationType = first(keys(goto));

    if (destinationType === "group") {
      ctx.routingGotos.push({ groupId: `group${groupId}`, ...goto });
    }
  }

  buildRoutingDestination(goto, pageId, ctx) {
    return new RoutingDestination(goto, pageId, ctx);
  }

  buildRoutingConditions(conditions) {
    return conditions ? new RoutingConditions(conditions) : null;
  }
}

module.exports = RoutingRule;
