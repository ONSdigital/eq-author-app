const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const mutation = `
  mutation ImportSections($input: ImportSectionsInput!) {
    importSections(input: $input) {
      id
    }
  }
`;

const importSections = async (ctx, input) => {
  const result = await executeQuery(
    mutation,
    {
      input: filter(
        gql`
          {
            questionnaireId
            sectionIds
            position {
              sectionId
              index
            }
          }
        `,
        input
      ),
    },
    ctx
  );

  return result.data.importSections;
};

module.exports = {
  mutation,
  importSections,
};
