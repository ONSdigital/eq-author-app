const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const executeQuery = require("../../executeQuery");

const createMetadataMutation = `
  mutation CreateMetadata($input: CreateMetadataInput!) {
    createMetadata(input: $input) {
      id
      alias
      key
      type
      dateValue
      regionValue
      languageValue
      textValue
      displayName
    }
  }
`;

const createMetadata = async (questionnaire, input) => {
  const result = await executeQuery(
    createMetadataMutation,
    {
      input: filter(
        gql`
          {
            questionnaireId
          }
        `,
        input
      ),
    },
    { questionnaire }
  );

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.createMetadata;
};

module.exports = {
  createMetadataMutation,
  createMetadata,
};
