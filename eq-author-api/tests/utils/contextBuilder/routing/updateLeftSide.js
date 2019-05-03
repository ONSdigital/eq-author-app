const executeQuery = require("../../executeQuery");

const updateLeftSideMutation = `
      mutation updateLeftSide2($input: UpdateLeftSide2Input!) {
        updateLeftSide2(input: $input) {
          id
        }
      }`;

const updateLeftSide = async (ctx, input) => {
  const result = await executeQuery(
    updateLeftSideMutation,
    {
      input,
    },
    ctx
  );
  return result.data.updateLeftSide2;
};

module.exports = {
  updateLeftSideMutation,
  updateLeftSide,
};
