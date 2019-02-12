const executeQuery = require("../../executeQuery");

const getSectionIntroductionQuery = `
  query GetSectionIntroduction($input: QueryInput!) {
    section(input: $input) {
      introduction {
        id
        introductionTitle
        introductionContent
        section {
          id
        }
      }
    }
  }
`;

const querySectionIntroduction = async (questionnaire, sectionId) => {
  const result = await executeQuery(
    getSectionIntroductionQuery,
    {
      input: { sectionId },
    },
    questionnaire
  );

  return result.data.section.introduction;
};

module.exports = {
  getSectionIntroductionQuery,
  querySectionIntroduction,
};
