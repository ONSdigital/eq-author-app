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

module.exports = {
  createQuestionnaire,
  createQuestionnaireMutation,
  deleteQuestionnaire,
  deleteQuestionnaireMutation,
  duplicateQuestionnaire,
  duplicateQuestionnaireMutation,
};
