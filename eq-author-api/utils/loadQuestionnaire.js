const fs = require("fs");

module.exports = questionnaireId =>
  fs.readFileSync(`data/${questionnaireId}.json`, "utf8");
