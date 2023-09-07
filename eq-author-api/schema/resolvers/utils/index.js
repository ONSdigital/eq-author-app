const logicGetters = require("./logicGetters");
const sectionGetters = require("./sectionGetters");
const folderGetters = require("./folderGetters");
const pageGetters = require("./pageGetters");
const answerGetters = require("./answerGetters");
const helpers = require("./helpers");
const theme = require("./theme");
const validation = require("./validation");
const listGetters = require("./listGetters");
const setDataVersion = require("./setDataVersion");
const supplemntaryDataGetters = require("./supplementaryDataGetters");
const authorisedRequest = require("./authorisedRequest");

module.exports = {
  ...logicGetters,
  ...sectionGetters,
  ...folderGetters,
  ...pageGetters,
  ...answerGetters,
  ...helpers,
  ...theme,
  ...validation,
  ...listGetters,
  ...setDataVersion,
  ...supplemntaryDataGetters,
  ...authorisedRequest,
};
