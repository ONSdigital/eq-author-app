const { flatMap, get, isNil } = require("lodash/fp");
const RadioRoutingCondition = require("./builders/routingcondition/RadioRoutingCondition");
const NumberRoutingCondition = require("./builders/routingcondition/NumberRoutingCondition");

const createBuilder = (answerType, condition, conditions) => {
  let builder = null;

  switch (answerType) {
    case "Radio":
      builder = new RadioRoutingCondition(condition, conditions);
      break;
    case "Number":
    case "Currency":
      builder = new NumberRoutingCondition(condition);
      break;
    default:
      throw new Error(
        `Routing condition with answer type ${answerType} is not supported.`
      );
  }

  return builder;
};

class RoutingConditions {
  constructor(conditions) {
    this.when = this.buildRoutingConditions(conditions);
  }

  buildRoutingConditions(conditions) {
    return flatMap(condition => {
      const answerType = get("answer.type", condition);

      if (isNil(answerType)) {
        throw new Error("Answer type is null or undefined");
      }

      return createBuilder(
        answerType,
        condition,
        conditions
      ).buildRoutingCondition();
    }, conditions);
  }
}

module.exports = RoutingConditions;
