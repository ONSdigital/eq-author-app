const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createOptionMutation = `
  mutation CreateOption($input: CreateOptionInput!) {
    createOption(input: $input) {
      id
      displayName
      label
      description
      value
      qCode
      additionalAnswer {
        id
      }
    }
  }
`;

const createOption = async (ctx, input) => {
  const result = await executeQuery(
    createOptionMutation,
    {
      input: filter(
        gql`
          {
            label
            description
            value
            qCode
            answerId
            hasAdditionalAnswer
          }
        `,
        input
      ),
    },
    ctx
  );

  return result.data.createOption;
};

const createMutuallyExclusiveOptionMutation = `
  mutation CreateMutuallyExclusiveOption($input: CreateMutuallyExclusiveOptionInput!) {
    createMutuallyExclusiveOption(input: $input) {
      id
      displayName
      label
      description
      value
      qCode
    }
  }
`;

const createMutuallyExclusiveOption = async (ctx, input) => {
  const result = await executeQuery(
    createMutuallyExclusiveOptionMutation,
    {
      input: filter(
        gql`
          {
            label
            description
            value
            qCode
            answerId
          }
        `,
        input
      ),
    },
    ctx
  );

  return result.data.createMutuallyExclusiveOption;
};

module.exports = {
  createOptionMutation,
  createOption,
  createMutuallyExclusiveOptionMutation,
  createMutuallyExclusiveOption,
};
