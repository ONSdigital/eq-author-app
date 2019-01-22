const fs = require("fs");
const stringify = require("json-stable-stringify");

module.exports = questionnaire => {
  fs.writeFileSync(
    `data/${questionnaire.id}.json`,
    stringify(questionnaire, { space: 4 })
  );
  return questionnaire;
};
