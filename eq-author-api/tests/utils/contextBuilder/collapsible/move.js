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

const moveCollapsible = async (ctx, input) => {
  const result = await executeQuery(moveCollapsibleMutation, { input }, ctx);
  return result.data.moveCollapsible;
};

module.exports = {
  moveCollapsibleMutation,
  moveCollapsible,
};
