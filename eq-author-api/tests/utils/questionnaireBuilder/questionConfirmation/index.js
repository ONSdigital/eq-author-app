const {
  createQuestionConfirmation,
  createQuestionConfirmationMutation,
} = require("./createQuestionConfirmation");

const {
  updateQuestionConfirmation,
  updateQuestionConfirmationMutation,
} = require("./updateQuestionConfirmation");

const {
  queryQuestionConfirmation,
  queryQuestionConfirmationMutation,
} = require("./queryQuestionConfirmation");

const {
  deleteQuestionConfirmation,
  deleteQuestionConfirmationMutation,
} = require("./deleteQuestionConfirmation");

module.exports = {
  createQuestionConfirmation,
  createQuestionConfirmationMutation,
  updateQuestionConfirmation,
  updateQuestionConfirmationMutation,
  queryQuestionConfirmation,
  queryQuestionConfirmationMutation,
  deleteQuestionConfirmation,
  deleteQuestionConfirmationMutation,
};
