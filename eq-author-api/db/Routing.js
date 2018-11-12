const db = require("./");
const { parseInt } = require("lodash");
const RoutingRuleSets = "Routing_RuleSets";
const RoutingRules = "Routing_Rules";
const RoutingConditions = "Routing_Conditions";
const RoutingConditionValues = "Routing_ConditionValues";
const RoutingDestinations = "Routing_Destinations";

const table = (tableName, knex = db) => knex(tableName);
const select = (tableName, knex = db) => table(tableName, knex).select();
const selectById = (tableName, id, knex = db) =>
  select(tableName, knex)
    .where("id", parseInt(id))
    .first();
const insert = (tableName, record, knex = db) =>
  table(tableName, knex)
    .insert(record)
    .returning("*");
const update = (tableName, id, record, knex = db) =>
  table(tableName, knex)
    .where("id", parseInt(id))
    .update(record)
    .returning("*");
const deleteById = (tableName, id, knex = db) =>
  table(tableName, knex)
    .where({ id })
    .del()
    .returning("*");

const findAllRoutingRuleSets = () => select(RoutingRuleSets);
const findAllRoutingRules = () => select(RoutingRules);
const findAllRoutingConditions = () => select(RoutingConditions);
const findAllRoutingConditionValues = () => select(RoutingConditionValues);

const findRoutingRuleSetsById = id => selectById(RoutingRuleSets, id);
const findRoutingRulesById = id => selectById(RoutingRules, id);
const findRoutingConditionValuesById = id =>
  selectById(RoutingConditionValues, id);
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

Object.assign(module.exports, {
  findAllRoutingRuleSets,
  findAllRoutingRules,
  findAllRoutingConditions,
  findAllRoutingConditionValues,
  findRoutingRuleSetsById,
  findRoutingRulesById,
  findRoutingConditionValuesById,
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
  updateRoutingDestination
});
