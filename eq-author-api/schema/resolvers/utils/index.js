const logicGetters = require("./logicGetters");
const sectionGetters = require("./sectionGetters");
const folderGetters = require("./folderGetters");
const pageGetters = require("./pageGetters");
const answerGetters = require("./answerGetters");
const helpers = require("./helpers");
const theme = require("./theme");
const validation = require("./validation");

module.exports = {
  ...logicGetters,
  ...sectionGetters,
  ...folderGetters,
  ...pageGetters,
  ...answerGetters,
  ...helpers,
  ...theme,
  ...validation,
};
