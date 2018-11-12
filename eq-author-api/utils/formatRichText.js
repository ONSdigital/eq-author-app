const cheerio = require("cheerio");
module.exports = (value, format) =>
  format === "Plaintext" ? cheerio(value).text() : value;
