const { createAnswer, createAnswerMutation } = require("./createAnswer");
const { updateAnswer, updateAnswerMutation } = require("./updateAnswer");
const { queryAnswer, getAnswerQuery } = require("./queryAnswer");

module.exports = {
  createAnswer,
  createAnswerMutation,
  updateAnswer,
  updateAnswerMutation,
  queryAnswer,
  getAnswerQuery,
};
