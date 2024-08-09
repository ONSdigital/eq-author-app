const executeQuery = require("../../executeQuery");

const getTotalPagesQuery = `
    query GetTotalPages($input: TotalPagesInput) {
        totalPages(input: $input)
    }
`;

const queryTotalPages = async (user, input) => {
  const result = await executeQuery(
    getTotalPagesQuery,
    input ? { input } : undefined, // Passes `undefined` when `input` is falsy to test when `input` is not provided
    {
      user,
    }
  );

  return result.data.totalPages;
};

module.exports = {
  getTotalPagesQuery,
  queryTotalPages,
};
