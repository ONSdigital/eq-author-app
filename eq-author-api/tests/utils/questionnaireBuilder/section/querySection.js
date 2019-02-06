const executeQuery = require("../../executeQuery");

const getSectionQuery = `
  query GetSection($input: QueryInput!) {
    section(input: $input) {
      id
      title
      position
      pages {
        id
      }
    }
  }
`;

const querySection = async (questionnaire, sectionId) => {
  const result = await executeQuery(
    getSectionQuery,
    {
      input: { sectionId },
    },
    questionnaire
  );

  return result.data.section;
};

module.exports = {
  getSectionQuery,
  querySection,
};
