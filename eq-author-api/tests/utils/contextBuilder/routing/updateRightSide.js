const executeQuery = require("../../executeQuery");

const updateRightSideMutation = `
      mutation updateRightSide2($input: UpdateRightSide2Input!) {
        updateRightSide2(input: $input) {
          id
        }
      }`;

const updateRightSide = async (ctx, input) => {
  const result = await executeQuery(
    updateRightSideMutation,
    {
      input,
    },
    ctx
  );
  return result.data.updateRightSide2;
};

module.exports = {
  updateRightSideMutation,
  updateRightSide,
};
