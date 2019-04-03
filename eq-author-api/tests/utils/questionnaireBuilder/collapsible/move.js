const executeQuery = require("../../executeQuery");

const moveCollapsibleMutation = `
  mutation MoveCollapsible($input: MoveCollapsibleInput!) {
    moveCollapsible(input: $input) {
      id
      introduction {
        id
        collapsibles {
          id
        }
      }
    }
  }
`;

const moveCollapsible = async (questionnaire, input) => {
  const result = await executeQuery(
    moveCollapsibleMutation,
    { input },
    { questionnaire }
  );
  return result.data.moveCollapsible;
};

module.exports = {
  moveCollapsibleMutation,
  moveCollapsible,
};
