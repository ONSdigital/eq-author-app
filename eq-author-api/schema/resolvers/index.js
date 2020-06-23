const base = require("./base");
const routing2 = require("./logic/routing2");
const binaryExpression2 = require("./logic/binaryExpression2");
const page = require("./pages");
const questionnaireIntroduction = require("./questionnaireIntroduction");

module.exports = [
  base,
  ...routing2,
  binaryExpression2,
  ...page,
  ...questionnaireIntroduction,
];
