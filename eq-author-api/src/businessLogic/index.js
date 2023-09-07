const createRouting = require("./createRouting");
const createRoutingRule = require("./createRoutingRule");
const createDestination = require("./createDestination");
const createExpressionGroup = require("./createExpressionGroup");
const createExpression = require("./createExpression");
const createLeftSide = require("./createLeftSide");
const createRightSide = require("./createRightSide");
const createQuestionPage = require("./createQuestionPage");
const createCalculatedSummary = require("./createCalculatedSummary");
const createFolder = require("./createFolder");
const createListCollectorFolder = require("./createListCollectorFolder");
const createSection = require("./createSection");
const createTheme = require("./createTheme");
const updateDestination = require("./updateDestination");
const createList = require("./createList");
const createListCollectorPage = require("./createListCollectorPage");
const {
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
} = require("./createListCollectorPages");

module.exports = {
  createRouting,
  createRoutingRule,
  createDestination,
  createExpressionGroup,
  createExpression,
  createLeftSide,
  createRightSide,
  createQuestionPage,
  createCalculatedSummary,
  createFolder,
  createListCollectorFolder,
  createSection,
  createTheme,
  updateDestination,
  createList,
  createListCollectorPage,
  createListCollectorQualifierPage,
  createListCollectorAddItemPage,
  createListCollectorConfirmationPage,
};
