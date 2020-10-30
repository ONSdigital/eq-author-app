const executeQuery = require("../../executeQuery");

const cancelHistoryNoteMutation = `
mutation CancelHistoryNote($input: cancelHistoryNoteInput!) {
    cancelHistoryNote(input: $input) {
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

const cancelHistoryNote = async (ctx, input) => {
  const result = await executeQuery(cancelHistoryNoteMutation, { input }, ctx);
  return result.data.cancelHistoryNote;
};

module.exports = {
  cancelHistoryNoteMutation,
  cancelHistoryNote,
};
