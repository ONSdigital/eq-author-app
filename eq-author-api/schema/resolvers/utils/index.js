const getters = require("./getters");
const sectionGetters = require("./sectionGetters");
const folderGetters = require("./folderGetters");
const pageGetters = require("./pageGetters");
const helpers = require("./helpers");
const theme = require("./theme");
const validation = require("./validation");

module.exports = {
  ...getters,
  ...sectionGetters,
  ...pageGetters,
  ...folderGetters,
  ...helpers,
  ...theme,
  ...validation,
};
