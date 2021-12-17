const executeQuery = require("../../executeQuery");

const createListMutation = `
  mutation CreateList {
    createList {
      id
      lists {
        id
        displayName
        listName
        validationErrorInfo {
          id
          totalCount
        }
      }
    }
  }
`;

const createList = async (ctx) => {
  const result = await executeQuery(createListMutation, {}, ctx);
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.createList;
};

module.exports = {
  createListMutation,
  createList,
};
