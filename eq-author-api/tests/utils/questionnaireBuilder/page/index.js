const {
  queryQuestionPage,
  queryQuestionPageMutation,
} = require("./queryQuestionPage");

const {
  createQuestionPage,
  createQuestionPageMutation,
} = require("./createQuestionPage");

const {
  updateQuestionPage,
  updateQuestionPageMutation,
} = require("./updateQuestionPage");

const {
  deleteQuestionPage,
  deleteQuestionPageMutation,
} = require("./deleteQuestionPage");

const { duplicatePage, duplicatePageMutation } = require("./duplicatePage");

module.exports = {
  queryQuestionPage,
  queryQuestionPageMutation,
  createQuestionPage,
  createQuestionPageMutation,
  updateQuestionPage,
  updateQuestionPageMutation,
  deleteQuestionPage,
  deleteQuestionPageMutation,
  duplicatePage,
  duplicatePageMutation,
};
