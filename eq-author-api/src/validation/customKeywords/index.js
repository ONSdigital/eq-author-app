const previousAnswer = require("./previousAnswer");

module.exports = ajv => {
  return [previousAnswer].reduce(
    (ajv, keyword) => ajv.addKeyword(keyword.keyword, keyword),
    ajv
  );
};
