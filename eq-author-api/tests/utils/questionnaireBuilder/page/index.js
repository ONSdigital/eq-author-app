const { queryPage, queryPageMutation } = require("./queryPage");

const {
  createQuestionPage,
  createQuestionPageMutation,
} = require("./createQuestionPage");

const {
  updateQuestionPage,
  updateQuestionPageMutation,
} = require("./updateQuestionPage");

const { deletePage, deletePageMutation } = require("./deletePage");

const { duplicatePage, duplicatePageMutation } = require("./duplicatePage");

const { movePage, movePageMutation } = require("./movePage");

module.exports = {
  queryPage,
  queryPageMutation,
  createQuestionPage,
  createQuestionPageMutation,
  updateQuestionPage,
  updateQuestionPageMutation,
  deletePage,
  deletePageMutation,
  duplicatePage,
  duplicatePageMutation,
  movePage,
  movePageMutation,
};
