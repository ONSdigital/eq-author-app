const getters = require("./getters");
const helpers = require("./helpers");
const theme = require("./theme");

module.exports = { ...getters, ...helpers, ...theme };
