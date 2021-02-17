const cheerio = require("cheerio");

const stripTags = (value) =>
  value && typeof value === "string" ? cheerio.load(value).text() : value;

module.exports = {
  stripTags,
};
