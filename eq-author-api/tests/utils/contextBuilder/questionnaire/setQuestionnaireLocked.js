const executeQuery = require("../../executeQuery");

const setQuestionnaireLockedMutation = `
  mutation SetLocked($input: SetQuestionnaireLockedInput!) {
    setQuestionnaireLocked(input: $input) {
      id
      locked
    }
  }
`;

const setQuestionnaireLocked = async (input, ctx) => {
  const result = await executeQuery(
    setQuestionnaireLockedMutation,
    { input },
    ctx
  );
  return result.data.setQuestionnaireLocked;
};

module.exports = {
  setQuestionnaireLocked,
  setQuestionnaireLockedMutation,
};
