const executeQuery = require("../../executeQuery");

const createHistoryNoteMutation = `
mutation CreateHistoryNote($input: createHistoryNoteInput!) {
    createHistoryNote(input: $input) {
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
    }
  }
`;

const createHistoryNote = async (ctx, input) => {
  const result = await executeQuery(createHistoryNoteMutation, { input }, ctx);
  return result.data.createHistoryNote;
};

module.exports = {
  createHistoryNoteMutation,
  createHistoryNote,
};
