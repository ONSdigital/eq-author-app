const cheerio = require("cheerio");
const { isNull, toString } = require("lodash");

const isHtml = value => !isNull(cheerio(value).html());

const stripTags = value =>
  isHtml(toString(value)) ? cheerio(value).text() : value;

module.exports = {
  isHtml,
  stripTags
};
