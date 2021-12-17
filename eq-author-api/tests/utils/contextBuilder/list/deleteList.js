const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const deleteListMutation = `
  mutation DeleteList($input: DeleteListInput) {
    deleteList(input: $input) {
      id
      listName
      displayName
    }
  }
`;

const deleteList = async (ctx, input) => {
  const result = await executeQuery(
    deleteListMutation,
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

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.deleteList;
};

module.exports = {
  deleteListMutation,
  deleteList,
};
