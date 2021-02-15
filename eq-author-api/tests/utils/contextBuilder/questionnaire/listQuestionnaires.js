const executeQuery = require("../../executeQuery");

const listQuestionnairesQuery = `
  query ListQuestionnaires {
    questionnaires {
      id
    }
  }
`;

const listQuestionnaires = async (user) => {
  const result = await executeQuery(listQuestionnairesQuery, {}, { user });
  return result.data.questionnaires;
};

module.exports = {
  listQuestionnaires,
  listQuestionnairesQuery,
};
