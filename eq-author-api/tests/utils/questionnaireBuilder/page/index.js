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

const {
  moveQuestionPage,
  moveQuestionPageMutation,
} = require("./moveQuestionPage");

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
  moveQuestionPage,
  moveQuestionPageMutation,
};
