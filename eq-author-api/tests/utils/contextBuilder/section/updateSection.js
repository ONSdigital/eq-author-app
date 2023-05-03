const executeQuery = require("../../executeQuery");

const updateSectionMutation = `
  mutation UpdateSection($input: UpdateSectionInput!) {
    updateSection(input: $input) {
      id
      title
      introductionEnabled
      introductionTitle
      introductionContent
      introductionPageDescription
      sectionSummary
      sectionSummaryPageDescription
      alias
      displayName
      position
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
      comments {
        id
        commentText
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
