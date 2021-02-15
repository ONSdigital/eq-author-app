const { xor, flow, flatMap, keyBy, map } = require("lodash/fp");

const getAllOptions = (condition) => {
  return condition.answer.options;
};

const keyOptionsById = flow(flatMap(getAllOptions), keyBy("id"));

class RadioRoutingCondition {
  constructor(condition, conditions) {
    this.condition = condition;
    this.optionsById = keyOptionsById(conditions);
  }

  buildRoutingCondition() {
    const unselectedIds = xor(
      this.condition.routingValue.value,
      map("id", this.condition.answer.options)
    );
    return unselectedIds
      .map((id) => ({
        id: `answer${this.condition.answer.id}`,
        condition: "not equals",
        value: this.optionsById[id].label,
      }))
      .concat({
        id: `answer${this.condition.answer.id}`,
        condition: "set",
      });
  }
}

module.exports = RadioRoutingCondition;
