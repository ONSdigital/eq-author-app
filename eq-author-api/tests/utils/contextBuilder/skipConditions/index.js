const {
  createSkipCondition,
  createSkipConditionMutation,
} = require("./createSkipCondition");

const {
  deleteSkipCondition,
  deleteSkipConditionMutation,
} = require("./deleteSkipCondition");

const {
  deleteSkipConditions,
  deleteSkipConditionsMutation,
} = require("./deleteSkipConditions");

module.exports = {
  createSkipCondition,
  createSkipConditionMutation,
  deleteSkipCondition,
  deleteSkipConditionMutation,
  deleteSkipConditions,
  deleteSkipConditionsMutation,
};
