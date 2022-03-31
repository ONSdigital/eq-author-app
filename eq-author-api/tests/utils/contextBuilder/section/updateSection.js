const executeQuery = require("../../executeQuery");

const updateSectionMutation = `
  mutation UpdateSection($input: UpdateSectionInput!) {
    updateSection(input: $input) {
      id
      title
      alias
      displayName
      position
      introductionTitle
      introductionContent
      summaryTitle
      folders {
        pages {
          ... on QuestionPage {
            id
          }
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

const updateSection = async (ctx, input) => {
  const result = await executeQuery(updateSectionMutation, { input }, ctx);
  return result.data.updateSection;
};

module.exports = {
  updateSectionMutation,
  updateSection,
};