const { curry } = require("lodash");

module.exports = curry(function mapValues(mapping, key) {
  return mapping[key];
});
