const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createListCollectorFolderMutation = `
  mutation CreateListCollectorFolder($input: CreateListCollectorFolderInput!) {
    createListCollectorFolder(input: $input) {
        id
        alias
        displayName
        position
        title
        ... on ListCollectorFolder {
            listId
        }
        pages {
            id
            pageType
            ... on ListCollectorQualifierPage {
                answers {
                    id
                    type
                    ... on MultipleChoiceAnswer {
                        options {
                            id
                        }
                    }
                }
            }
            ... on ListCollectorConfirmationPage {
                answers {
                    id
                    type
                    ... on MultipleChoiceAnswer {
                        options {
                            id
                        }
                    }
                }
            }
        }
        section {
            id
        }
        validationErrorInfo {
          id
          totalCount
        }
    }
  }
`;

const createListCollectorFolder = async (ctx, input) => {
  const result = await executeQuery(
    createListCollectorFolderMutation,
    {
      input: filter(
        gql`
          {
            sectionId
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

  return result.data.createListCollectorFolder;
};

module.exports = {
  createListCollectorFolderMutation,
  createListCollectorFolder,
};
