const executeQuery = require("../../executeQuery");

const getSectionQuery = `
  query GetSection($input: QueryInput!) {
    section(input: $input) {
      id
      title
      alias
      displayName
      position
      pages {
        id
      }
      questionnaire {
        id
      }
      availablePipingAnswers {
        id
      }
      availablePipingMetadata {
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
    { questionnaire }
  );

  return result.data.section;
};

module.exports = {
  getSectionQuery,
  querySection,
};
