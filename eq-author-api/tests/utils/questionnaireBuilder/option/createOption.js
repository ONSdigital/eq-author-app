const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createOptionMutation = `
  mutation CreateOption($input: CreateOptionInput!) {
    createOption(input: $input) {
      id
      displayName
      label
      description
      value
      qCode
    }
  }
`;

const createOption = async (questionnaire, input) => {
  const result = await executeQuery(
    createOptionMutation,
    {
      input: filter(
        gql`
          {
            label
            description
            value
            qCode
            answerId
            hasAdditionalAnswer
          }
        `,
        input
      ),
    },
    { questionnaire }
  );

  return result.data.createOption;
};

module.exports = {
  createOptionMutation,
  createOption,
};
