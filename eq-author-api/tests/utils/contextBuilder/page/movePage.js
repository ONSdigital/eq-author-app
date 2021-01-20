const executeQuery = require("../../executeQuery");

const movePageMutation = `
  mutation MovePage($input: MovePageInput!) {
    movePage(input: $input) {
      id
      title
      alias
      displayName
      pageType
      section {
        id
        folders {
          id
          pages {
            id
          }
        }
      }
      position
      availablePipingAnswers {
        id
      }
      availablePipingMetadata {
        id
      }
      ... on QuestionPage {
        description
        guidance
        answers {
          id
        }
        definitionLabel
        definitionContent
        additionalInfoLabel
        additionalInfoContent
        confirmation {
          id
        }
        routing {
          id
        }
        availableRoutingAnswers {
          id
        }
        availableRoutingDestinations {
          logicalDestinations {
            id
          }
        } 
      }
    }
  }
`;

const movePage = async (ctx, input) => {
  const result = await executeQuery(movePageMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.movePage;
};

module.exports = {
  movePageMutation,
  movePage,
};
