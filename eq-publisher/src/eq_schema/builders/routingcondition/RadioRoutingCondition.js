const { xor, concat, flow, flatMap, keyBy, map } = require("lodash/fp");

const getAllOptions = condition => {
  if (condition.answer.other) {
    return concat(condition.answer.options, condition.answer.other.option);
  } else {
    return condition.answer.options;
  }
};

const keyOptionsById = flow(
  flatMap(getAllOptions),
  keyBy("id")
);

class RadioRoutingCondition {
  constructor(condition, conditions) {
    this.condition = condition;
    this.optionsById = keyOptionsById(conditions);
  }

  buildRoutingCondition() {
    const unselectedIds = xor(
      this.condition.routingValue.value,
      map("id", getAllOptions(this.condition))
    );
    return unselectedIds
      .map(id => ({
        id: `answer${this.condition.answer.id}`,
        condition: "not equals",
        value: this.optionsById[id].label
      }))
      .concat({
        id: `answer${this.condition.answer.id}`,
        condition: "set"
      });
  }
}

module.exports = RadioRoutingCondition;
