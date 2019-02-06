const fs = require("fs");

module.exports = questionnaire => {
  fs.unlinkSync(`data/${questionnaire.id}.json`);
  return questionnaire;
};
