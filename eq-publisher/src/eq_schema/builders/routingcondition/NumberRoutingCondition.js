const comparatorLookup = {
  Equal: "equals",
  NotEqual: "not equals",
  GreaterThan: "greater than",
  GreaterOrEqual: "greater than or equal to",
  LessThan: "less than",
  LessOrEqual: "less than or equal to",
};

class NumberRoutingCondition {
  constructor(condition) {
    this.condition = condition;
  }

  buildRoutingCondition() {
    return {
      id: `answer${this.condition.answer.id}`,
      condition: comparatorLookup[this.condition.comparator],
      value: this.condition.routingValue.numberValue,
    };
  }
}

module.exports = NumberRoutingCondition;
