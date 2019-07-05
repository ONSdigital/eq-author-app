const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const executeQuery = require("../../executeQuery");

const deleteOptionMutation = `
  mutation DeleteOption($input: DeleteOptionInput!) {
    deleteOption(input: $input) {
      id
      __typename
    }
  }
`;

const deleteOption = async (ctx, input) => {
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
    ctx
  );

  return result.data.deleteOption;
};

module.exports = {
  deleteOptionMutation,
  deleteOption,
};
