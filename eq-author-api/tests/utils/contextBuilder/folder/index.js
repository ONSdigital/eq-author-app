const { createFolder } = require("./createFolder");
const { deleteFolder } = require("./deleteFolder");
const { moveFolder } = require("./moveFolder");
const { createListCollectorFolder } = require("./createListCollectorFolder");
const { updateFolder } = require("./updateFolder");
const { duplicateFolder } = require("./duplicateFolder");

module.exports = {
  createFolder,
  deleteFolder,
  moveFolder,
  updateFolder,
  duplicateFolder,
  createListCollectorFolder,
};
