const executeQuery = require("../../executeQuery");

const getOptionQuery = `
  query GetOption($input: QueryInput!) {
    option(input: $input) {
      id
      displayName
      label
      description
      value
      qCode
      additionalAnswer {
        id
        label
      }
    }
  }
`;

const queryOption = async (ctx, id) => {
  const result = await executeQuery(
    getOptionQuery,
    {
      input: { optionId: id },
    },
    ctx
  );

  return result.data.option;
};

module.exports = {
  getOptionQuery,
  queryOption,
};
