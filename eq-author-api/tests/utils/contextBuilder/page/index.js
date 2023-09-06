const { queryPage, queryPageMutation } = require("./queryPage");

const { deletePage, deletePageMutation } = require("./deletePage");

const { duplicatePage, duplicatePageMutation } = require("./duplicatePage");

const { movePage, movePageMutation } = require("./movePage");

const { updatePage, updatePageMutation } = require("./updatePage");

module.exports = {
  queryPage,
  queryPageMutation,
  deletePage,
  deletePageMutation,
  duplicatePage,
  duplicatePageMutation,
  movePage,
  movePageMutation,
  updatePage,
  updatePageMutation,
};
