const { createRouting, createRoutingMutation } = require("./createRouting");

const { updateRouting, updateRoutingMutation } = require("./updateRouting");

const {
  createRoutingRule,
  createRoutingRuleMutation,
} = require("./createRule");

const {
  deleteRoutingRuleMutation,
  deleteRoutingRule,
} = require("./deleteRule");

const {
  updateRoutingRule,
  updateRoutingRuleMutation,
} = require("./updateRoutingRule");

const { moveRoutingRule, moveRoutingRuleMutation } = require("./moveRule");

const {
  createBinaryExpression,
  createBinaryExpressionMutation,
} = require("./createBinaryExpression");

const {
  updateBinaryExpression,
  updateBinaryExpressionMutation,
} = require("./updateBinaryExpression");

const {
  deleteBinaryExpression,
  deleteBinaryExpressionMutation,
} = require("./deleteBinaryExpression");

const {
  updateExpressionGroup,
  updateExpressionGroupMutation,
} = require("./updateExpressionGroup");

const {
  updateRightSideMutation,
  updateRightSide,
} = require("./updateRightSide");

const { updateLeftSideMutation, updateLeftSide } = require("./updateLeftSide");

module.exports = {
  createRouting,
  createRoutingMutation,
  updateRouting,
  updateRoutingMutation,
  createRoutingRule,
  createRoutingRuleMutation,
  updateRoutingRule,
  updateRoutingRuleMutation,
  moveRoutingRule,
  moveRoutingRuleMutation,
  deleteRoutingRuleMutation,
  deleteRoutingRule,
  createBinaryExpression,
  createBinaryExpressionMutation,
  updateBinaryExpression,
  updateBinaryExpressionMutation,
  deleteBinaryExpression,
  deleteBinaryExpressionMutation,
  updateExpressionGroup,
  updateExpressionGroupMutation,
  updateRightSideMutation,
  updateRightSide,
  updateLeftSideMutation,
  updateLeftSide,
};
