const cheerio = require("cheerio");

const stripTags = (value) => value && cheerio.load(value).text();

module.exports = {
  stripTags,
};
