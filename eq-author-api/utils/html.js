const cheerio = require("cheerio");
const { isNull, toString, trim } = require("lodash");

const isHtml = (value) => !isNull(cheerio(trim(value)).html());

const stripTags = (value) =>
  isHtml(toString(value)) ? cheerio(value).text() : value;

module.exports = {
  isHtml,
  stripTags,
};
