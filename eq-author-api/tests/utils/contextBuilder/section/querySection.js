const executeQuery = require("../../executeQuery");

const getSectionQuery = `
  query GetSection($input: QueryInput!) {
    section(input: $input) {
      id
      title
      pageDescription
      alias
      displayName
      position
      folders {
        id
        pages {
          id
        }
      }
      questionnaire {
        id
      }
      validationErrorInfo {
        totalCount
        errors {
          id
        }
      }
    }
  }
`;

const querySection = async (ctx, sectionId) => {
  const result = await executeQuery(
    getSectionQuery,
    {
      input: { sectionId },
    },
    ctx
  );

  return result.data.section;
};

module.exports = {
  getSectionQuery,
  querySection,
};
