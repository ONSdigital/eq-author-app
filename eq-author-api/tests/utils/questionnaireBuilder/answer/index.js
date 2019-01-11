const { createAnswer, createAnswerMutation } = require("./createAnswer");
const { updateAnswer, updateAnswerMutation } = require("./updateAnswer");
const { queryAnswer, queryAnswerQuery } = require("./queryAnswer");
const { deleteAnswer, deleteAnswerQuery } = require("./deleteAnswer");

module.exports = {
  createAnswer,
  createAnswerMutation,
  updateAnswer,
  updateAnswerMutation,
  queryAnswer,
  queryAnswerQuery,
  deleteAnswer,
  deleteAnswerQuery,
};
