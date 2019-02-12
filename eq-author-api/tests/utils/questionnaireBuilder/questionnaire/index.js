const {
  createQuestionnaire,
  createQuestionnaireMutation,
} = require("./createQuestionnaire");

const {
  deleteQuestionnaire,
  deleteQuestionnaireMutation,
} = require("./deleteQuestionnaire");

const {
  duplicateQuestionnaire,
  duplicateQuestionnaireMutation,
} = require("./duplicateQuestionnaire");

const {
  updateQuestionnaire,
  updateQuestionnaireMutation,
} = require("./updateQuestionnaire");

const {
  queryQuestionnaire,
  queryQuestionnaireMutation,
} = require("./queryQuestionnaire");

module.exports = {
  createQuestionnaire,
  createQuestionnaireMutation,
  deleteQuestionnaire,
  deleteQuestionnaireMutation,
  duplicateQuestionnaire,
  duplicateQuestionnaireMutation,
  updateQuestionnaire,
  updateQuestionnaireMutation,
  queryQuestionnaire,
  queryQuestionnaireMutation,
};
