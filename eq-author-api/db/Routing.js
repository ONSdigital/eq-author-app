const { parseInt } = require("lodash");
const RoutingRuleSets = "Routing_RuleSets";
const RoutingRules = "Routing_Rules";
const RoutingConditions = "Routing_Conditions";
const RoutingConditionValues = "Routing_ConditionValues";
const RoutingDestinations = "Routing_Destinations";

module.exports = knex => {
  const table = tableName => knex(tableName);
  const select = tableName => table(tableName).select();
  const selectById = (tableName, id) =>
    select(tableName)
      .where("id", parseInt(id))
      .first();
  const insert = (tableName, record) =>
    table(tableName)
      .insert(record)
      .returning("*");
  const update = (tableName, id, record) =>
    table(tableName)
      .where("id", parseInt(id))
      .update(record)
      .returning("*");
  const deleteById = (tableName, id) =>
    table(tableName)
      .where({ id })
      .del()
      .returning("*");

  const findAllRoutingRuleSets = () => select(RoutingRuleSets);
  const findAllRoutingRules = () => select(RoutingRules);
  const findAllRoutingConditions = () => select(RoutingConditions);
  const findAllRoutingConditionValues = () => select(RoutingConditionValues);

  const findRoutingDestinationById = id => selectById(RoutingDestinations, id);

  const createRoutingRuleSet = values => insert(RoutingRuleSets, values);
  const createRoutingRule = values => insert(RoutingRules, values);
  const createRoutingCondition = values => insert(RoutingConditions, values);
  const createRoutingConditionValue = values =>
    insert(RoutingConditionValues, values);

  const updateRoutingRuleSet = (id, values) =>
    update(RoutingRuleSets, id, values);
  const updateRoutingRule = (id, values) => update(RoutingRules, id, values);
  const updateRoutingCondition = (id, values) =>
    update(RoutingConditions, id, values);
  const updateRoutingConditionValue = (id, values) =>
    update(RoutingConditionValues, id, values);

  const updateRoutingDestination = (id, values) =>
    update(RoutingDestinations, id, values);

  const deleteRoutingCondition = id => deleteById(RoutingConditions, id);

  return {
    findAllRoutingRuleSets,
    findAllRoutingRules,
    findAllRoutingConditions,
    findAllRoutingConditionValues,
    createRoutingRuleSet,
    createRoutingRule,
    createRoutingCondition,
    createRoutingConditionValue,
    updateRoutingRuleSet,
    updateRoutingRule,
    updateRoutingCondition,
    updateRoutingConditionValue,
    deleteRoutingCondition,
    findRoutingDestinationById,
    updateRoutingDestination,
  };
};
