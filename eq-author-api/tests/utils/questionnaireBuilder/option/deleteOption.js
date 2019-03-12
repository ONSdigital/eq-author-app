const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const executeQuery = require("../../executeQuery");

const deleteOptionMutation = `
  mutation DeleteOption($input: DeleteOptionInput!) {
    deleteOption(input: $input) {
      id
    }
  }
`;

const deleteOption = async (questionnaire, input) => {
  const result = await executeQuery(
    deleteOptionMutation,
    {
      input: filter(
        gql`
          {
            id
          }
        `,
        input
      ),
    },
    { questionnaire }
  );

  return result.data.deleteOption;
};

module.exports = {
  deleteOptionMutation,
  deleteOption,
};
