const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createSectionIntroductionMutation = `
  mutation CreateSectionIntroduction($input: CreateSectionIntroductionInput!) {
    createSectionIntroduction(input: $input) {
      id
      introductionTitle
      introductionContent
    }
  }
`;

const createSectionIntroduction = async (questionnaire, input) => {
  const result = await executeQuery(
    createSectionIntroductionMutation,
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
  return result.data.createSectionIntroduction;
};

module.exports = {
  createSectionIntroductionMutation,
  createSectionIntroduction,
};
