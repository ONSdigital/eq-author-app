const cheerio = require("cheerio");

const stripTags = (value) =>
  typeof value === "string" ? cheerio(value).text() : value;

module.exports = {
  stripTags,
};
