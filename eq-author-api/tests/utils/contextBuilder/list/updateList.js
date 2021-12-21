const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const updateListMutation = `
  mutation UpdateList($input: UpdateListInput) {
    updateList(input: $input) {
      id
      displayName
      listName
      validationErrorInfo {
        id
        totalCount
      }
    }
  }
`;

const updateList = async (ctx, input) => {
  const result = await executeQuery(
    updateListMutation,
    {
      input: filter(
        gql`
          {
            id
            listName
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

  return result.data.updateList;
};

module.exports = {
  updateListMutation,
  updateList,
};
