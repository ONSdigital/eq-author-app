const executeQuery = require("../../executeQuery");

const deleteHistoryNoteMutation = `
mutation DeleteHistoryNote($input: deleteHistoryNoteInput!) {
    deleteHistoryNote(input: $input) {
      id
      publishStatus
      questionnaireTitle
      bodyText
      user {
        id
        email
        name
        displayName
      }
      time
      type
    }
  }
`;

const deleteHistoryNote = async (ctx, input) => {
  const result = await executeQuery(deleteHistoryNoteMutation, { input }, ctx);
  return result.data.deleteHistoryNote;
};

module.exports = {
  deleteHistoryNoteMutation,
  deleteHistoryNote,
};
