const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const executeQuery = require("../../executeQuery");

const moveOptionMutation = `
  mutation MoveOption($input: MoveOptionInput!) {
    moveOption(input: $input) {
      id
      options {
        id
      }
      __typename
    }
  }
`;

const moveOption = async (ctx, input) => {
  const result = await executeQuery(
    moveOptionMutation,
    {
      input: filter(
        gql`
          {
            id
            position
          }
        `,
        input
      ),
    },
    ctx
  );

  return result.data.moveOption;
};

module.exports = {
  moveOptionMutation,
  moveOption,
};
