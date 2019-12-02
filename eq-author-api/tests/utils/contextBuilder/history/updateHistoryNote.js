const executeQuery = require("../../executeQuery");

const updateHistoryNoteMutation = `
mutation UpdateHistoryNote($input: updateHistoryNoteInput!) {
    updateHistoryNote(input: $input) {
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

const updateHistoryNote = async (ctx, input) => {
  const result = await executeQuery(updateHistoryNoteMutation, { input }, ctx);
  return result.data.updateHistoryNote;
};

module.exports = {
  updateHistoryNoteMutation,
  updateHistoryNote,
};
