const executeQuery = require("../../executeQuery");

const moveSectionMutation = `
  mutation MoveSection($input: MoveSectionInput!) {
    moveSection(input: $input) {
      id
      title
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
    }
  }
`;

const moveSection = async (ctx, input) => {
  const result = await executeQuery(moveSectionMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.moveSection;
};

module.exports = {
  moveSectionMutation,
  moveSection,
};
