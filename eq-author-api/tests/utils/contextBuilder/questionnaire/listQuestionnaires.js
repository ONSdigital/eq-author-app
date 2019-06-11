const executeQuery = require("../../executeQuery");

const listQuestionnairesQuery = `
  query ListQuestionnaires {
    questionnaires {
      id
    }
  }
`;

const listQuestionnaires = async () => {
  const result = await executeQuery(listQuestionnairesQuery);
  return result.data.questionnaires;
};

module.exports = {
  listQuestionnaires,
  listQuestionnairesQuery,
};
