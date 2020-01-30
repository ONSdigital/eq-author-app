const base = require("./base");
const routing2 = require("./routing2");
const page = require("./pages");
const questionnaireIntroduction = require("./questionnaireIntroduction");
const comments = require("./comments");

module.exports = [
  base,
  ...routing2,
  ...page,
  ...questionnaireIntroduction,
  ...comments,
];
