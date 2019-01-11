const executeQuery = require("../../executeQuery");

const updateRightSideMutation = `
      mutation updateRightSide2($input: UpdateRightSide2Input!) {
        updateRightSide2(input: $input) {
          id
        }
      }`;

const updateRightSide = async (questionnaire, input) => {
  const result = await executeQuery(
    updateRightSideMutation,
    {
      input,
    },
    { questionnaire }
  );
  return result.data.updateRightSide2;
};

module.exports = {
  updateRightSideMutation,
  updateRightSide,
};
