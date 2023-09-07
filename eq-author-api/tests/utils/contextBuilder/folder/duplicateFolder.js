const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const duplicateFolderMutation = `
  mutation DuplicateFolder($input: DuplicateFolderInput!) {
    duplicateFolder(input: $input) {
        id
        alias
        title
        ... on ListCollectorFolder {
            listId
        }
        pages {
            id
            ... on QuestionPage {
                pageType
                title
                pageDescription
                description
                descriptionEnabled
                guidanceEnabled
                definitionEnabled
                additionalInfoEnabled
                answers {
                    id
                }
                routing {
                    id
                }
                alias
            }
        }
        position
        section {
         id
        }
        displayName
        validationErrorInfo {
          id
          totalCount
        }
    }
  }
`;

const duplicateFolder = async (ctx, input) => {
  const result = await executeQuery(
    duplicateFolderMutation,
    {
      input: filter(
        gql`
          {
            id
            position
          }
        `,
        input
      ),
    },
    ctx
  );

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.duplicateFolder;
};

module.exports = {
  duplicateFolderMutation,
  duplicateFolder,
};
