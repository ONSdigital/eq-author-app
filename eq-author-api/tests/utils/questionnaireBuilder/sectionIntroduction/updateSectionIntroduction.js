const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const updateSectionIntroductionMutation = `
  mutation UpdateSectionIntroduction($input: UpdateSectionIntroductionInput!) {
    updateSectionIntroduction(input: $input) {
      id
      introductionTitle
      introductionContent
    }
  }
`;

const updateSectionIntroduction = async (questionnaire, input) => {
  const result = await executeQuery(
    updateSectionIntroductionMutation,
    {
      input: filter(
        gql`
          {
            sectionId
            introductionTitle
            introductionContent
          }
        `,
        input
      ),
    },
    { questionnaire }
  );
  return result.data.updateSectionIntroduction;
};

module.exports = {
  updateSectionIntroductionMutation,
  updateSectionIntroduction,
};
